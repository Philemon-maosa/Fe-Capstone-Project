HomeMenuApp
Project Name: HomeMenuApp – Personal Kitchen & Recipe Manager
Project Type: Fullstack Web Application (Django backend + HTML/CSS/JS frontend)
Author: Philemon Maosa
Date: 2025
________________________________________
Project Overview
HomeMenuApp is a web application designed to help users manage their kitchen ingredients and explore recipes.
Key features include:
•	User authentication with JWT tokens.
•	Adding and managing ingredients in a personal pantry.
•	Viewing recipes and getting suggested recipes based on pantry ingredients (planned functionality).
The project demonstrates fullstack development skills using Django REST Framework for the backend and a JavaScript frontend for dynamic interaction.
________________________________________
Features Implemented
1.	User Authentication
	Users can sign up, log in, and log out successfully.
	JWT token stored in browser localStorage for session management.

2.	Navigation
     	“My Kitchen” button works and navigates to the kitchen page.
	“Ingredients” button opens the ingredient interface.

3.	Ingredients Management (Partial)
	Users can add ingredients they need to buy and also the quantity.
	Currently, delete functionality and full CRUD on ingredients is not fully functional.
________________________________________
Current Limitations / Known Issues
 Important: Features that are not fully functional:
1.	Ingredients Management
	The "Ingredients" interface opens, but adding new ingredients may fail in some cases depending on API response.
	Deleting ingredients does not work.
	This is likely due to backend URL mismatches or API request handling.

2.	View Recipes
	The "View Recipes" and "Get Suggested Recipes" features do not work.
	Clicking these buttons results in network errors (405 / 401) due to incorrect endpoints or missing authentication handling.

3.	UI/UX
	Buttons and input forms are functional in layout, but some alignment and styling improvements can make the interface more visually appealing.

Notes for Mentor

The navigation and frontend layout are mostly complete.

"My Kitchen" button works and shows the interface.

"Ingredients" button opens the UI but backend integration is incomplete.

"View Recipes" and "Get Suggested Recipes" features are not functional yet.

Backend endpoints exist, but frontend calls need adjustments to match the correct URLs and authentication.
________________________________________
Tech Stack
•	Backend: Django, Django REST Framework, Simple JWT
•	Frontend: HTML, CSS, JavaScript (Axios for API calls)
•	Hosting: PythonAnywhere
•	Styling: Custom CSS with optional Tailwind
________________________________________
Project Structure
HomeMenuApp/
├─ homemenu_app/
│  ├─ urls.py
│  ├─ views.py
├─ pantry/
│  ├─ urls.py
│  ├─ views.py
├─ recipes/
│  ├─ urls.py
│  ├─ views.py
├─ js/
│  ├─ kitchenlist.js
│  ├─ recipes.js
├─ css/
│  ├─ style.css
├─ templates/
│  ├─ kitchenlist.html
│  ├─ recipes.html
│  ├─ homepage.html

