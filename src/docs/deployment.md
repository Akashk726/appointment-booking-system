# Deployment Instructions

This document outlines the steps to deploy the Appointment Booking System on AWS. The application uses AWS S3 for hosting the web form, DynamoDB for storing bookings, SES for sending confirmation emails, Lambda for processing requests, and API Gateway for exposing the backend API.

## Prerequisites

- AWS account with access to S3, DynamoDB, SES, Lambda, and API Gateway.
- AWS CLI configured (optional, for easier deployment).
- Project files from the repository (`src/web/index.html`, `src/lambda/index.js`).
- Git repository cloned locally.

## Step-by-Step Deployment

### 1. Set Up IAM Role for Lambda

1. Navigate to **IAM** &gt; **Roles** in the AWS Console.
2. Create a role (`LambdaBookingRole`):
   - Select **AWS Service** &gt; **Lambda** as the trusted entity.
   - Attach policies:
     - `AmazonDynamoDBFullAccess`
     - `AmazonSESFullAccess`
     - `AWSLambdaBasicExecutionRole`
   - Save and note the role ARN.

### 2. Configure Amazon SES

1. Go to **SES** &gt; **Email Addresses** in `us-east-1`.
2. Verify a sender email:
   - Click **Verify a New Email Address**, enter an email (e.g., `your-verified-email@example.com`), and confirm via the verification email.
3. If in sandbox mode, verify recipient emails or request production access via **SES** &gt; **Sending Statistics** &gt; **Request Production Access**.

### 3. Create DynamoDB Table

1. Go to **DynamoDB** &gt; **Tables** in `us-east-1`.
2. Create a table:
   - Name: `Appointments`
   - Partition key: `id` (String)
   - Use default settings (provisioned capacity with auto-scaling).
3. Confirm the table is **Active**.

### 4. Deploy Lambda Function

1. Go to **Lambda** &gt; **Functions** in `us-east-1`.
2. Create a function:
   - Name: `BookingFunction`
   - Runtime: **Node.js 18.x**
   - Role: Select `LambdaBookingRole`
3. Upload code:
   - Copy `src/lambda/index.js` from the repository.
   - Replace `your-verified-email@example.com` with your SES-verified email.
   - Paste into the Lambda code editor or upload as a ZIP file.
4. Configure:
   - Set timeout to 10 seconds, memory to 128 MB.
   - Click **Deploy**.

### 5. Set Up API Gateway

1. Go to **API Gateway** &gt; **APIs** in `us-east-1`.
2. Create a REST API:
   - Name: `BookingAPI`
   - Protocol: REST
3. Create a resource:
   - Path: `/booking`
   - Enable CORS
4. Add a POST method:
   - Integration type: **Lambda Function**
   - Select `BookingFunction`
5. Enable CORS:
   - Select `/booking`, click **Actions** &gt; **Enable CORS**, and confirm.
6. Deploy the API:
   - Create a stage (e.g., `prod`).
   - Note the Invoke URL (e.g., `https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/booking`).

### 6. Host Web Form on S3

1. Go to **S3** &gt; **Buckets**.
2. Create a bucket:
   - Name: `appointment-booking-app` (must be unique)
   - Region: `us-east-1`
   - Disable **Block all public access**
3. Enable static website hosting:
   - Go to **Properties** &gt; **Static website hosting**.
   - Set index document to `index.html`.
   - Note the website endpoint (e.g., `http://appointment-booking-app.s3-website-us-east-1.amazonaws.com`).
4. Set bucket policy:
   - Go to **Permissions** &gt; **Bucket Policy**.
   - Add:

     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Sid": "PublicReadGetObject",
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "arn:aws:s3:::appointment-booking-app/*"
             }
         ]
     }
     ```
   - Replace `appointment-booking-app` with your bucket name.
5. Upload web form:
   - Copy `src/web/index.html` from the repository.
   - Replace `YOUR_API_GATEWAY_ENDPOINT` with the API Gateway Invoke URL.
   - Upload to the S3 bucket.

## Post-Deployment

1. Update the repository:
   - Commit changes to `src/web/index.html` and `src/lambda/index.js` with actual URLs and email addresses.
   - Push to GitHub:

     ```bash
     git add src/
     git commit -m "Update index.html and index.js with deployed URLs and email"
     git push origin main
     ```
2. Update `README.md` with the S3 bucket URL and repository details.

## Testing

1. Open the S3 bucket URL in a browser.
2. Submit a booking:
   - Use a verified email if in SES sandbox mode.
   - Verify the success message.
3. Check DynamoDB for the booking record.
4. Confirm the email is received with appointment details.
5. Capture screenshots of the email for submission.

## Troubleshooting

- **Form Errors**: Check Lambda logs in **CloudWatch**.
- **CORS Issues**: Ensure CORS is enabled in API Gateway.
- **SES Errors**: Verify email addresses and region (`us-east-1`).

## Clean Up

To avoid charges:

- Delete the S3 bucket.
- Delete the DynamoDB table.
- Delete the Lambda function.
- Delete the API Gateway.
- Remove SES verified emails.
