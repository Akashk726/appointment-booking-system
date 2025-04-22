const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { name, email, service, dateTime } = body;

    // Store booking in DynamoDB
    const params = {
        TableName: 'Appointments',
        Item: {
            id: Date.now().toString(),
            name,
            email,
            service,
            dateTime
        }
    };

    try {
        await dynamoDB.put(params).promise();

        // Send confirmation email via SES
        const emailParams = {
            Source: 'your-verified-email@example.com',
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: 'Appointment Confirmation' },
                Body: {
                    Text: {
                        Data: `Hello ${name},\n\nYour appointment for ${service} on ${dateTime} has been booked.\n\nThank you!`
                    }
                }
            }
        };

        await ses.sendEmail(emailParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Booking successful' }),
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process booking' }),
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        };
    }
};
