const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// it defines the shape of course's documents in our MongoDB database 
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

// Now we need to compile the courseSchema into a model
// first argument is the singular name of the collection that this module is for
const Course = mongoose.model('Course', courseSchema);


async function createCourse() {
  // Now, we can create an object based on that class
  const course = new Course({
    name: 'Angular Course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true
  });

  // this result is the actual course object that is saved in the database
  // when we saved this course in MongoDB, it goings to assign an unique identifier
  // to this course object/document
  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  // Comparison Operators
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  const pageNumber = 2;
  const pageSize = 10;

  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course
    .find({ author: 'Mosh', isPublished: true })
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $in: [10, 15, 20] } })
    // .find()
    // .or([{ author: 'Mosh' }, { isPublished: true }])
    // Starts with Mosh
    // .find({ author: /^Mosh/ })
    // Ends with Hamedani
    // .find({ author: /Hamedani$/i })
    // Contains Mosh
    // .find({ author: /.*Mosh.*/i })
    // We use this to implement pagination
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 }) // 1 indicates ascending order, -1 indicates descending order
    .select({ name: 1, tags: 1 });
    // .count();
    console.log(courses);
}

async function updateCourse(id) {
  // Approach: Query First
  // findById()
  // Modify its properties
  // save()
  const course = await Course.findById(id);
  if (!course) return;
  // course.isPublished = true;
  // course.author = 'Another Author';
  course.set({
    isPublished: true,
    author: 'Another Author'
  });

  const result = await course.save();

  console.log(result);
}

async function updateCourse(id) {
  // Approach: Update First
  // Update directly
  // Optionally: get the updated document
  // const result = await Course.update({ _id: id }, {
  //   $set: {
  //     author: 'Mosh',
  //     isPublished: false
  //   }
  // });
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Jason',
      isPublished: false
    }
}, { new: true });

  console.log(course);
}

async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

removeCourse('5d6c4da9edd49f2890447332');