const router = require('express').Router();
const { Profile } = require('../model/profile');
const auth = require('../middleware/auth');

// Get dashboard analytics 
router.get('/dashboard', auth, async (req, res) => {
    try {
        // Only admins can access
        if (req.user.role !== 'admin') {
            return res.status(403).send('Only admins can access analytics');
        }

        // Get all profiles
        const profiles = await Profile.find().populate('user', 'username email');

        // Calculate average CGPA
        const avgCGPA = profiles.length > 0 
            ? (profiles.reduce((sum, p) => sum + p.cgpa, 0) / profiles.length).toFixed(2)
            : 0;

        // Get top 3 students
        const top3 = profiles.sort((a, b) => b.score - a.score).slice(0, 3);

        // Get skills distribution
        const skillsMap = {};
        profiles.forEach(profile => {
            profile.skills.forEach(skill => {
                skillsMap[skill] = (skillsMap[skill] || 0) + 1;
            });
        });

        const skillsDistribution = Object.entries(skillsMap).map(([skill, count]) => ({
            skill,
            count
        })).sort((a, b) => b.count - a.count);

        res.send({
            totalStudents: profiles.length,
            avgCGPA,
            top3,
            skillsDistribution
        });
    } catch (err) {
        res.status(500).send('Error fetching analytics: ' + err.message);
    }
});

// Search students with filters
router.get('/students', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send('Only admins can access this');
        }

        const { search, minCgpa, skill } = req.query;

        let query = {};

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by minimum CGPA
        if (minCgpa) {
            query.cgpa = { $gte: parseFloat(minCgpa) };
        }

        // Filter by skill
        if (skill) {
            query.skills = { $in: [skill] };
        }

        const students = await Profile.find(query)
            .populate('user', 'username email')
            .sort({ score: -1 });

        // Add rank
        const rankedStudents = students.map((s, index) => ({
            ...s.toObject(),
            rank: index + 1
        }));

        res.send(rankedStudents);
    } catch (err) {
        res.status(500).send('Error searching students: ' + err.message);
    }
});

module.exports = router;
