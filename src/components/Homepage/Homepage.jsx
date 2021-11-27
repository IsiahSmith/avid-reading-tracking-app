import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

//Material-UI imports
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';

function HomePage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const books = useSelector((store) => store.books);
    const progress = useSelector((store) => store.progress);

    // Gets all reading sessions and books from the logged in user on page load
    useEffect(() => {
        dispatch({ type: 'FETCH_BOOKS' });
        dispatch({ type: 'FETCH_PROGRESS' });
    }, []);

    let currentlyReading = books.filter(book => book.rating === null);
    let progressForBook = progress.filter(session => session.rating === null);

    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '30vh' }}
            >
                <h2>Currently Reading</h2>
                {books.length > 0 ? <div>
                    {currentlyReading.map((book) => {

                        let bookSessions = progressForBook.filter(session => session.book_id === book.id);
                        let recentSession = bookSessions[bookSessions.length - 1];

                        return (
                            <div key={book.id}>
                                <div>{book.title}, by {book.author}
                                    <Button variant='outlined' onClick={() => history.push(`/edit/${book.id}`)}>EDIT</Button>
                                    <Button variant='outlined' onClick={() => history.push(`/update/${book.id}`)}>UPDATE PROGRESS</Button>
                                    <Button variant='outlined' onClick={() => history.push(`/complete/${book.id}`)}>COMPLETE</Button>
                                </div>
                                {recentSession &&
                                    <div>
                                        <p>Currently on Page {recentSession?.page}</p>
                                        <p>Last Read on {recentSession?.date.split('T')[0]}</p>
                                        <p>Logged {recentSession?.duration} hours of reading last session</p>
                                    </div>}
                            </div>
                        )
                    })}
                </div> : <p> You're not tracking any books yet! Click 'ADD BOOK' to get started!</p>}
                <Button variant='contained' onClick={() => history.push('/addbook')}>ADD BOOK</Button>
            </Grid>
        </>
    );
}

// this allows us to use <App /> in index.js
export default HomePage;