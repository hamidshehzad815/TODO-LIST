import nodemailer from "nodemailer";

async function registraionEmail(email) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to ZenTask - Let's Begin Your Productivity Journey",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 32px;">Zen<span style="color: #1e293b;">Task</span></h1>
          </div>

          <h2 style="color: #1e293b; text-align: center; font-size: 24px; margin-bottom: 30px;">Welcome to Your Productivity Sanctuary</h2>

          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            🎉 Great to have you here! You're about to embark on a journey towards better task management and increased productivity.
          </p>

          <div style="margin: 30px 0; padding: 20px; border-radius: 8px; background: linear-gradient(145deg, #f8faff 0%, #eef2ff 100%);">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0;">
              "The journey of a thousand tasks begins with a single click." 
              <br><br>
              Ready to bring zen to your workflow? Just one quick step remains:
            </p>
            
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #f8faff; border-radius: 8px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">What's next?</h3>
            <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Create your first project</li>
              <li>Invite team members</li>
              <li>Set up your personalized workflow</li>
            </ul>
          </div>

          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Stay productive,<br>
            <strong>The ZenTask Team</strong>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
              If you didn't create a ZenTask account, please ignore this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function taskAssignedEmail(creator, email, isLoggedIn = false) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const taskUrl = isLoggedIn
    ? "http://localhost:3000/mytasks"
    : "http://localhost:3000/login";

  const buttonText = isLoggedIn ? "View Task Details" : "Login to View Task";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Task Awaits Your Magic ✨",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 32px;">Zen<span style="color: #1e293b;">Task</span></h1>
          </div>

          <h2 style="color: #1e293b; text-align: center; font-size: 24px; margin-bottom: 30px;">A New Adventure Awaits!</h2>

          <div style="background: linear-gradient(145deg, #f8faff 0%, #eef2ff 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0;">
              ${creator.username} has chosen you for an important mission! 🎯
            </p>
          </div>

          ${
            !isLoggedIn
              ? `
          <div style="background-color: #fff4f4; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #6366f1;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0;">
              ⚡ Please log in to your ZenTask account to view and manage your new task.
            </p>
          </div>
          `
              : ""
          }

          <div style="background-color: #f8faff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Quick Actions:</h3>
            <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>View task details</li>
              <li>Set your timeline</li>
              <li>Connect with ${creator.username}</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${taskUrl}" 
               style="display: inline-block; padding: 12px 30px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; transition: all 0.3s ease;">
              ${buttonText}
            </a>
          </div>

          <div style="margin-top: 20px;">
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Need to connect with ${creator.username}?<br>
              Reach out at: <a href="mailto:${
                creator.email
              }" style="color: #6366f1; text-decoration: none;">${
      creator.email
    }</a>
            </p>
          </div>

          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Happy tasking!<br>
            <strong>The ZenTask Team</strong>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
              This is an automated message from ZenTask. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendReminderEmail(creator, taskDetails) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: creator.email,
    subject: "Reminder: Upcoming Task Due Soon ⏰",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 32px;">Zen<span style="color: #1e293b;">Task</span></h1>
          </div>

          <h2 style="color: #1e293b; text-align: center; font-size: 24px; margin-bottom: 30px;">Friendly Reminder!</h2>

          <div style="background: linear-gradient(145deg, #f8faff 0%, #eef2ff 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0;">
              Hi ${creator.username}, this is a gentle reminder that you have an upcoming task due soon!
            </p>
          </div>

          <div style="background-color: #f8faff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Task Details:</h3>
            <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li><strong>Title:</strong> ${taskDetails.title}</li>
              <li><strong>Description:</strong> ${taskDetails.description}</li>
              <li><strong>Due Date:</strong> ${taskDetails.dueDate}</li>
              <li><strong>Priority:</strong> ${taskDetails.priority}</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/mytasks" 
               style="display: inline-block; padding: 12px 30px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; transition: all 0.3s ease;">
              View Task Details
            </a>
          </div>


          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Happy tasking!<br>
            <strong>The ZenTask Team</strong>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
              This is an automated message from ZenTask. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export { registraionEmail, taskAssignedEmail, sendReminderEmail };
