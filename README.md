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
