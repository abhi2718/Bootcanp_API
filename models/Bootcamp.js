const mongoose=require('mongoose'),
      bootcampSchema= new mongoose.Schema({
        name: {
          type: String,
          required: [true, 'Name is required'],
          unique: true,
          trim: true,
          maxlength: [20, 'Name can not be more than 20 characters']
        },
        slug: String,
        description: {
          type: String,
          required: [true, 'Description is required'],
          maxlength: [500, 'Description can not be more than 500 characters']
        },
        website: {
          type: String,
          unique:true,
          match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
          ]
        },
        phone: {
          type: String,
          unique:true,
          maxlength: [10, 'Phone number can not be longer than 10 characters'],
          required:[true ,'Phone number is required']
        },
        email: {
          type: String,
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
          ],
          required:[true ,'Email is required']
        },
        address: {
          type: String,
          required: [true, ' Address is required']
        },
        location: {
          // GeoJSON Point
          type: {
            type: String,
            enum: ['Point']
          },
          coordinates: {
            type: [Number],
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          pincode: String,
          country: String
        },
        careers: {
          // Array of strings
          type: [String],
          required: [true ,'Careers are requred'],
          enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
          ]
        },
        averageRating: {
          type: Number,
          min: [1, 'Rating must be at least 1'],
          max: [10, 'Rating must can not be more than 10']
        },
        averageCost: Number,
        photo: {
          type: String,
          default: 'no-photo.jpg'
        },
        housing: {
          type: Boolean,
          default: false
        },
        jobAssistance: {
          type: Boolean,
          default: false
        },
        jobGuarantee: {
          type: Boolean,
          default: false
        },
        acceptGi: {
          type: Boolean,
          default: false
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      });
module.exports=mongoose.model('Bootcamp',bootcampSchema);