# Appointment Booking System

A serverless web application for booking appointments, storing data in AWS DynamoDB, and sending confirmation emails via AWS SES.

## Overview

This project allows users to book appointments through a web form hosted on AWS S3. Bookings are processed by AWS Lambda, exposed via API Gateway, and stored in DynamoDB. Confirmation emails are sent using AWS SES.

## Features

- Web form to collect Name, Email, Service, and Date & Time.
- Stores booking data in DynamoDB.
- Sends automated email confirmations via SES.
- Serverless backend with Lambda and API Gateway.
- Static website hosting on S3.

## Project Structure

appointment-booking-system/
├── src/
│   ├── web/
│   │   └── index.html       # Web form
│   ├── lambda/
│   │   └── index.js         # Lambda function
├── docs/
│   └── deployment.md        # Deployment guide
├── .gitignore               # Git ignore file
├── README.md                # This file


## Setup

1. Clone the Repository:

   ```bash
   git clone <git url>
   cd appointment-booking-system
2. Prerequisites:

- AWS account.
- Git installed.
- AWS CLI (optional).

3. Configure Files:

- Update src/web/index.html with your API Gateway URL.
- Update src/lambda/index.js with your SES-verified email.

Deployment

1. S3:

- Create an S3 bucket and enable static website hosting.
- Upload src/web/index.html.
- Set public read policy.

2. DynamoDB:

- Create a table Appointments with id (String) as the partition key.

3. SES:

- Verify a sender email in us-east-1.

4. Lambda:

- Create a function with src/lambda/index.js.
- Attach IAM role for DynamoDB and SES.

5. API Gateway:

- Create a REST API with a POST method for /booking.
- Link to Lambda and enable CORS.
See docs/deployment.md for detailed steps.
