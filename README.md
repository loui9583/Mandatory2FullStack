Use a web framework. Svelte.
Use a database. MongoDB
Add notifications. Toastr brugt når man er logget ind og tilføjer/sletter noter, og i ForgotPasswordForm og ResetPassword
Email: Jeg har opsat nodemailer med en ny gmail, hvor jeg bruger google app password så jeg kan connecte nodemailer, så jeg kan automatisere både at sende og modtage emails. Jeg har sat det op sådan så man får sendt en mail hver gang man logger ind, og man kan også få sendt en link til at resette sit password.
Backend:
You need to implement authentication:
The passwords must be hashed (Bcrypt) ☑
You need to implement authorization:
JWT ☑
Frontend:
You need to implement authentication here too:
The minimum requirement is a Login/Sign out component. (Sign up/Forgot password are optional).  Har lavet Sign in, Sign out, Sign up og forgot password 
You need to implement authorization here too:
Protect your routes. Har brugt svelte navigator og har “protected” profile siden, så man skal være logget ind og have en token før man kan åbne den
