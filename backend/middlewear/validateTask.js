const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  
  if (req.method === 'POST' || req.method === 'PUT') {
    if (title && title.trim().length > 200) {
      return res.status(400).json({ 
        message: "Title must be less than 200 characters" 
      });
    }
    
    if (description && description.trim().length > 2000) {
      return res.status(400).json({ 
        message: "Description must be less than 2000 characters" 
      });
    }
  }
  
  next();
};

module.exports = validateTask;