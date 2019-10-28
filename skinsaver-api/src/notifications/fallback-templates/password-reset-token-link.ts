
export const render = (link, email, token) => {
    return `
        <html>
            <h1>Reset your password</h1>
            <p>You're receiving this email because you requested a password reset for your account. </p>

            <p>Please use the following link to reset you password</p>
            <p><a href=${link}>${link}</a></p>
            <br/>

            <small><b>Password reset token:</b></small><br/>
            <small>${token}</small>

            <p>Regards,</br>
            The GLI team</p>
        </html>
`;
};
