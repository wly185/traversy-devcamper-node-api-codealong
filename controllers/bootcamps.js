//@desc    get all bootcamps
//@route   GET /api/vi1/bootcamps
//@access  public
exports.getBootcamps = (req, res, next) => {
  res.send('get all bootcamps');
};

//@desc    get single bootcamps
//@route   GET /api/vi1/bootcamps/:id
//@access  public

exports.getBootcamp = (req, res, next) => {
  res.send('get single bootcamp');
};

//@desc    create new bootcamp
//@route   POST /api/vi1/bootcamps
//@access  private

exports.createBootcamp = (req, res, next) => {
  res.send('create new bootcamp');
};

//@desc    edit bootcamp
//@route   PUT /api/vi1/bootcamps/:id
//@access  private

exports.updateBootcamp = (req, res, next) => {
  res.send('update bootcamp');
};

//@desc    delete bootcamp
//@route   DELETE /api/vi1/bootcamps/:id
//@access  private

exports.deleteBootcamp = (req, res, next) => {
  res.send('delete bootcamp');
};
