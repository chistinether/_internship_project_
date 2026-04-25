import React, { useState } from "react";

function CreateAccount({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    otherNames: "",
    email: "",
    course: "",
    university: "",
    phone: "",
    yearOfStudy: "",
    internshipPlace: "",
    supervisor: "",
  });

  const [step, setStep] = useState("form"); // form → verify → success
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep("verify");
  };

  const sendVerification = (method) => {
  setVerifyMethod(method);
  const generated = Math.floor(1000 + Math.random() * 9000).toString();
  setSentCode(generated);
  alert(`Verification code sent to ${formData[method]}: ${generated}`);
};


  const checkCode = () => {
    if (code === sentCode) {
      setStep("success");
    } else {
      alert("Incorrect code, try again.");
    }
  };

  if (step === "form") {
    return (
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="surname" placeholder="Surname" onChange={handleChange} required />
        <input name="otherNames" placeholder="Other Names" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="course" placeholder="Course" onChange={handleChange} required />
        <input name="university" placeholder="University" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="yearOfStudy" placeholder="Year of Study" onChange={handleChange} required />
        <input name="internshipPlace" placeholder="Internship Place" onChange={handleChange} required />
        <input name="supervisor" placeholder="Supervisor" onChange={handleChange} required />
        <button type="submit">Signup</button>
      </form>
    );
  }

  if (step === "verify") {
    return (
      <div>
        <h2>Verify Account</h2>
        <p>Choose verification method:</p>
        <button onClick={() => sendVerification("email")}>Verify by Email</button>
        <button onClick={() => sendVerification("phone")}>Verify by Phone</button>

        {verifyMethod && (
          <div>
            <input
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={checkCode}>Submit Code</button>
          </div>
        )}
      </div>
    );
  }

  if (step === "success") {
    return (
      <div>
        <h2>Signup Successful!</h2>
        <button onClick={onSignupSuccess}>Login</button>
      </div>
    );
  }
}

export default CreateAccount;