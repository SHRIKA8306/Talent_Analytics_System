const mongoose = require('mongoose');
const Joi = require('joi');

const profileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        name: { type: String, required: true },
        cgpa: { type: Number, required: true, min: 0, max: 10 },
        profilePic: { type: String, default: '' },
        skills: [
            {
                name: { type: String, required: true },
                level: { type: Number, default: 50, min: 0, max: 100 }
            }
        ],
        projects: { type: Number, default: 0, min: 0 },
        score: { type: Number, default: 0 },
        rank: { type: Number }
    },
    { timestamps: true }
);

// Calculate score before saving
profileSchema.pre('save', function(next) {
    const skillsScore = this.skills.reduce((acc, s) => acc + (s.level || 0), 0) / 10;
    this.score = (this.cgpa * 10) + skillsScore + (this.projects * 10);
    next();
});

const Profile = mongoose.model('Profile', profileSchema);

const profileSchema_validate = Joi.object({
    name: Joi.string().required(),
    cgpa: Joi.number().min(0).max(10).required(),
    profilePic: Joi.string().allow('', null),
    skills: Joi.array().items(
        Joi.object({
            _id: Joi.string().optional(),
            name: Joi.string().required(),
            level: Joi.number().min(0).max(100).default(50)
        })
    ),
    projects: Joi.number().min(0)
});

module.exports = { Profile, profileSchema_validate };
