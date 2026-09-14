
// Define Home Page controller function
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
}

// Export Home Page controller function
export { showHomePage}