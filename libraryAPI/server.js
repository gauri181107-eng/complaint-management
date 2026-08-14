const express = require('express'); 
const app = express(); const PORT = 3000; 
app.use(express.json());
const books =
    [ { id: 1, title: 'JavaScript Basics', author: 'John Smith', category: 'Programming', available: true },
    { id: 2, title: 'Python Programming', author: 'Mark Lee', category: 'Programming', available: true }, 
    { id: 3, title: 'Database Management', author: 'Robert Brown', category: 'Database', available: true }, 
    { id: 4, title: 'Computer Networks', author: 'Andrew Wilson', category: 'Networking', available: true } 
]; 

const students = 
    [ { id: 1, name: 'Ravi', email: 'ravi@gmail.com', course: 'Computer Science' }, 
    { id: 2, name: 'Rahul', email: 'rahul@gmail.com', course: 'Information Science' }, 
    { id: 3, name: 'Anu', email: 'anu@gmail.com', course: 'Computer Science' } 
];

/*Issued book */
let issued_books = []; 
let next_issue_id = 1;

/*Find book*/ 
function find_book(book_id) {
     return books.find(function(book) { 
        return book.id === Number(book_id); 
    }); 
}

/*Find student*/
function find_student(student_id) { 
    return students.find(function(student) { 
        return student.id === Number(student_id); 
    }); 
}

/*home route */
app.get('/', function(request, response) { 
    response.send('College Library Management API is running'); 
});

/*Get all book*/
app.get('/api/books', function(request, response) { 
    response.json(books); 
});

/*Get one book*/
app.get('/api/books/:id', function(request, response) { 
    const book = find_book(request.params.id); 
    if (!book) { 
        return response.status(404).json({ message: 'Book not found' }); 
    } 
    response.json(book); 
});

/*get all student*/
app.get('/api/students', function(request, response) { 
    response.json(students); 
});

/*Get one student*/ 
app.get('/api/students/:id', function(request, response) { 
    const student = find_student(request.params.id); 
    if (!student) { 
        return response.status(404).json({ message: 'Student not found' }); 
    } 
    response.json(student); 
});
/*Get all essue*/ 
app.get('/api/issues', function(request, response) { 
    response.json(issued_books); 
});

/*Essue book*/
app.post('/api/issues', function(request, response) { 
    const { student_id,
        book_id, 
        issue_date 
    } = request.body; 
    /*Find student*/
    const student = find_student(student_id); 
    /*Find book*/ 
    const book = find_book(book_id); 
    // Check required fields*/ 
    if (!student_id || !book_id || !issue_date) {
        return response.status(400).json({ message: 'Complete every issue field.' }); 
    } 
    /*Check student */
    if (!student) { 
        return response.status(404).json({ message: 'Student not found.' }); 
    }
     /* Check book */
    if (!book) { 
        return response.status(404).json({ message: 'Book not found.' }); 
    } 
    // Check book availability 
    if (!book.available) { 
        return response.status(400).json({ message: 'Book is already issued.' }); 
    } 
    /* Create issue record */
    const new_issue = { 
        id: next_issue_id, 
        student_id: student.id, 
        student_name: student.name, 
        book_id: book.id, 
        book_title: book.title, 
        issue_date: issue_date, 
        return_date: null, 
        status: 'Issued' 
    }; 
    // Add issue record 
    issued_books.push(new_issue);
    // Make book unavailable 
    book.available = false;
    // Increase issue ID
    next_issue_id += 1; 

     response.status(201).json(   /*stutus code */
       { message: 'Book issued successfully.', issue: new_issue 

    });
});

/*Return book*/ 
app.put('/api/issues/:id/return', function(request, response) { 
    const issue_id = Number(request.params.id); /*dynamic parameter */

    // Find issued book 
    const issue = issued_books.find(function(item) { 
        return item.id === issue_id; 
    }); 

    // Check issue record 
    if (!issue) { 
        return response.status(404).json({ message: 'Issue record not found.' });
    } 

    // Update issue
    const return_date = new Date(); // or request.body.return_date if client sends it
    issue.return_date = return_date;
    issue.status = 'Returned';

    // Make book available again
    const book = find_book(issue.book_id); 
    if (book) { 
        book.available = true; 
    } 

    // Send success response
    response.json({ 
        message: 'Book returned successfully.', 
        issue: issue 
    }); 
});

/*Delete Issue Record */
app.delete('/api/issues/:id', function(request, response) {   
    const issue_id = Number(request.params.id); 

    // Find index of issue
    const issue_index = issued_books.findIndex(function(item) { 
        return item.id === issue_id; 
    }); 

    // If not found
    if (issue_index === -1) { 
        return response.status(404).json({ message: 'Issue record not found.' }); 
    } 

    // Remove issue from array
    const deleted_issue = issued_books.splice(issue_index, 1)[0]; 

    // Make book available again
    const book = find_book(deleted_issue.book_id); 
    if (book) { 
        book.available = true; 
    } 

    // Send response
    response.json({ 
        message: 'Issue record deleted successfully.', 
        issue: deleted_issue 
    }); 
});
/*Invalid Route */
app.use(function(request, response) {
    response.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, function() {
    console.log(`College Library API is running at http://localhost:${PORT}`);
});
