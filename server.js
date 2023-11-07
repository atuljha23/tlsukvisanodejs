const axios = require("axios");
const nodemailer = require("nodemailer");

// Replace with your email and password
const emailConfig = {
  user: "your_email@gmail.com",
  pass: "your_email_password",
};

const tlsAppointmentURL =
  "https://visas-de.tlscontact.com/services/customerservice/api/tls/appointment/gb/gbLON2de/table?client=de&formGroupId=2119885&appointmentType=Short_Stay_Tourism&appointmentStage=appointment";

const checkAppointmentAvailability = async () => {
  try {
    const response = await axios.get(tlsAppointmentURL);
    const appointmentData = response.data;

    // Loop through the response to find available appointments
    for (const date in appointmentData) {
      const timeSlots = appointmentData[date];
      for (const time in timeSlots) {
        if (timeSlots[time] > 0) {
          // Send an email when an appointment is found
          sendEmail(`Appointment available on ${date} at ${time}`);
          return;
        }
      }
    }
    console.log("No available appointments found.");
  } catch (error) {
    console.error("Error while checking appointments:", error);
  }
};

const sendEmail = (message) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });

  const mailOptions = {
    from: emailConfig.user,
    to: "recipient@example.com", // Replace with the recipient's email address
    subject: "TLS Germany Appointment Available",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error while sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Run the appointment availability check every 5 minutes
const interval = 5 * 60 * 1000; // 5 minutes in milliseconds
setInterval(checkAppointmentAvailability, interval);

// Initial check on server startup
checkAppointmentAvailability();
