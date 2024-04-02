# 📦 Inventory Management System Backend
[Notion page](https://danielmariadasilva.notion.site/Inventory-Management-System-68b2bf294cf34752b0f695cbfcc61f50)

This project serves as the backend for an Inventory Management System, where inventory management occurs for multiple locations. It allows users to manage inventory for various locations efficiently.

## Getting Started

To run the project, you can use either nodemon or node command:

```sh
nodemon index
```

or

```sh
node index
```

## Environment Setup

Before running the project, ensure you have set up the environment variables in a .env file with the following structure:

```
DB_URL=mongodb+srv://<user>:<password>@<cluster>.h9amcus.mongodb.net/<database>?retryWrites=true&w=majority&appName=<cluster>
API_TOKEN=RANDOM_TOKEN
```

## Initial Setup

Upon the first launch of the system, use the following credentials to begin utilizing it:

- Email: `admin@admin.com`
- Password: `admin`

### Functionality

The backend provides endpoints for various functionalities, including:

- User authentication
- Location management
- Product management
- Inventory management

### Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose

Feel free to explore and integrate this backend into your Inventory Management System project!
