# Smart Expense Hub

Build a full-stack web application called:

"Smart Expense Tracker"

Goal:
Help users track daily expenses, view summaries, and manage budgets with a clean dashboard.

Frontend:
- Modern, responsive UI.
- Pages:
  - Landing page
  - Login / Signup
  - Dashboard
- Dashboard features:
  - Add / edit / delete expenses
  - Fields: amount, category, date, note
  - Expense list with filters (date, category)
  - Summary cards: total, monthly spend, top category
  - Charts for category-wise and monthly expenses
  - Budget input and progress bar
- Dark / light mode.
- Toast notifications.
- Mobile-friendly layout.

Backend:
- REST API using Node.js + Express.
- JWT-based authentication.
- CRUD APIs for expenses.
- User-specific data isolation.
- Budget APIs.
- Input validation and error handling.
- Middleware for auth and logging.

Database:
- MongoDB with Mongoose schemas:
  - User: name, email, password
  - Expense: userId, amount, category, date, note
  - Budget: userId, month, limit

Tech Stack:
Frontend: React or Next.js, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB

Extras:
- Pagination for expense list.
- Search by note.
- Export expenses to CSV.
- API documentation.
- Clean component structure.
- Environment-based config.

Output Required:
- Complete frontend code.
- Complete backend code.
- API routes and controllers.
- Mongoose schemas.
- Folder structure.
- Seed data.
- README with setup and run instructions.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://trace-your-expense.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d8f18395-7947-4fa8-908b-53e44e8da4c1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
