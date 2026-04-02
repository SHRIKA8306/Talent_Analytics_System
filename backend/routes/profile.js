const router = require('express').Router();
const { Profile, profileSchema_validate } = require('../model/profile');
const auth = require('../middleware/auth');
const { User } = require('../model/user');
const rolesData = require('../data/rolesData');

// Get user's own profile
router.get('/', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id })
            .populate('user', 'username email');

        if (!profile) {
            return res.status(404).send('Profile not found');
        }

        // Calculate rank on the fly
        const allProfiles = await Profile.find().sort({ score: -1 });
        const rank = allProfiles.findIndex(p => p.user.toString() === req.user.id) + 1;
        const total = allProfiles.length;

        res.send({ ...profile.toObject(), rank, totalStudents: total });
    } catch (err) {
        res.status(500).send('Error fetching profile: ' + err.message);
    }
});

// Get student dashboard data with score breakdown
router.get('/dashboard', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id })
            .populate('user', 'username email');

        if (!profile) {
            return res.status(404).send('Profile not found');
        }

        const cgpaScore = profile.cgpa * 10;
        const skillsScore = profile.skills.reduce((acc, s) => acc + (s.level || 0), 0) / 10;
        const projectsScore = profile.projects * 10;

        res.send({
            name: profile.name,
            cgpa: profile.cgpa,
            skills: profile.skills,
            projects: profile.projects,
            totalScore: profile.score,
            profilePic: profile.profilePic,
            breakdown: {
                cgpa: cgpaScore,
                skills: skillsScore,
                projects: projectsScore
            }
        });
    } catch (err) {
        res.status(500).send('Error fetching dashboard data: ' + err.message);
    }
});

// Dynamic Recommendation System endpoint
router.get('/recommendation', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).send('Profile not found');

        const studentSkills = profile.skills.map(s => 
            (typeof s === 'string' ? s : s.name).toLowerCase().trim()
        );

        if (studentSkills.length === 0) {
             return res.send({
                 recommendedRole: "Upload skills to get recommendations",
                 matchPercentage: 0,
                 matchedSkills: [],
                 missingSkills: [],
                 topRoles: []
             });
        }

        const analysis = rolesData.map(role => {
            const matchedSkills = role.requiredSkills.filter(skill => 
                studentSkills.includes(skill.toLowerCase().trim())
            );

            const matchPercentage = (matchedSkills.length / role.requiredSkills.length) * 100;

            return {
                role: role.role,
                matchPercentage: Math.round(matchPercentage),
                matchedSkills,
                missingSkills: role.requiredSkills.filter(skill => !matchedSkills.includes(skill))
            };
        });

        analysis.sort((a, b) => b.matchPercentage - a.matchPercentage);

        const recommendedRole = analysis[0];
        const topRoles = analysis.slice(0, 3);

        res.send({
            recommendedRole: recommendedRole.role,
            matchPercentage: recommendedRole.matchPercentage,
            matchedSkills: recommendedRole.matchedSkills,
            missingSkills: recommendedRole.missingSkills,
            topRoles: topRoles
        });

    } catch(err) {
        res.status(500).send('Error fetching recommendation data: ' + err.message);
    }
});

// Get student talent analytics insights
router.get('/insights', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).send('Profile not found');

        // 1. Performance Level
        let performanceLevel = "Beginner";
        if (profile.score >= 80 && profile.score <= 130) performanceLevel = "Intermediate";
        else if (profile.score > 130) performanceLevel = "Advanced";

        // 2. Strengths
        let strengths = [];
        if (profile.cgpa >= 8.0) strengths.push("Strong Academics");
        if (profile.skills.length >= 5) strengths.push("Strong Skillset");
        if (profile.projects >= 3) strengths.push("Practical Experience");
        if (strengths.length === 0) strengths.push("Building Foundation");

        // 3. Weaknesses
        let weaknesses = [];
        if (profile.cgpa < 7.0) weaknesses.push("Needs Academic Improvement");
        if (profile.skills.length < 3) weaknesses.push("Needs More Skills");
        if (profile.projects < 2) weaknesses.push("Needs Practical Projects");

        // 4. Career Readiness
        const studentSkills = profile.skills.map(s => 
            (typeof s === 'string' ? s : s.name).toLowerCase().trim()
        );
        let bestMatchPercentage = 0;
        
        if (studentSkills.length > 0) {
            for (const roleObj of rolesData) {
                let matchedCount = 0;
                for (let rSkill of roleObj.requiredSkills) {
                    if (studentSkills.includes(rSkill.toLowerCase().trim())) {
                        matchedCount++;
                    }
                }
                const matchPercent = (matchedCount / roleObj.requiredSkills.length) * 100;
                if (matchPercent > bestMatchPercentage) {
                    bestMatchPercentage = matchPercent;
                }
            }
        }

        let readinessLevel = "Low Readiness";
        if (bestMatchPercentage >= 30 && bestMatchPercentage <= 70) readinessLevel = "Moderate Readiness";
        else if (bestMatchPercentage > 70) readinessLevel = "High Readiness";

        // 5. Smart Summary
        let summary = "Keep learning and building projects to solidify your career readiness.";
        if (strengths.includes("Strong Academics") && weaknesses.includes("Needs Practical Projects")) {
            summary = "You have a strong academic background but need to improve practical skills through projects to become job-ready.";
        } else if (strengths.includes("Practical Experience") && weaknesses.includes("Needs More Skills")) {
            summary = "You have great practical experience but need to learn more core skills to secure top roles.";
        } else if (strengths.length >= 2 && weaknesses.length === 0) {
            summary = "You have an exceptionally well-rounded profile and are well-prepared for industry roles!";
        } else if (weaknesses.length >= 2) {
            summary = "Focus on building your foundation by maintaining academic consistency and picking up foundational technologies.";
        }
        
        res.send({
            performanceLevel,
            strengths,
            weaknesses,
            readinessLevel,
            summary
        });

    } catch (err) {
        res.status(500).send('Error fetching insights: ' + err.message);
    }
});

// GET Skill Analytics
router.get('/skill-analytics', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).send('Profile not found');

        // Handle legacy skills (convert strings to objects on the fly)
        const skills = profile.skills.map(s => {
            if (typeof s === 'string') return { name: s, level: 50 };
            return s;
        });

        if (skills.length === 0) {
            return res.send({
                skills: [],
                strongestSkill: null,
                weakestSkill: null,
                averageSkillLevel: 0,
                weakSkills: []
            });
        }

        let strongestSkill = skills[0];
        let weakestSkill = skills[0];
        let totalLevel = 0;
        let weakSkills = [];

        skills.forEach(skill => {
            if (skill.level > strongestSkill.level) strongestSkill = skill;
            if (skill.level < weakestSkill.level) weakestSkill = skill;
            if (skill.level < 50) weakSkills.push(skill.name);
            totalLevel += skill.level;
        });

        const averageSkillLevel = Math.round(totalLevel / skills.length);

        res.send({
            skills,
            strongestSkill,
            weakestSkill,
            averageSkillLevel,
            weakSkills
        });
    } catch (err) {
        res.status(500).send('Error fetching skill analytics: ' + err.message);
    }
});

// Get user's rank and total student count
router.get('/rank', auth, async (req, res) => {
    try {
        const allProfiles = await Profile.find().sort({ score: -1 });
        const rank = allProfiles.findIndex(p => p.user.toString() === req.user.id) + 1;
        
        if (rank === 0) return res.status(404).send('Profile/Rank not found');

        res.send({
            rank,
            totalStudents: allProfiles.length
        });
    } catch (err) {
        res.status(500).send('Error calculating rank: ' + err.message);
    }
});


// Create or update student profile
router.post('/', auth, async (req, res) => {
    try {
        const { error, value } = profileSchema_validate.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if profile exists
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update existing profile
            profile.name = value.name;
            profile.cgpa = value.cgpa;
            profile.skills = value.skills || [];
            profile.projects = value.projects || 0;
            if (value.profilePic !== undefined) profile.profilePic = value.profilePic;
            // Score is calculated by the pre-save middleware
            await profile.save();
        } else {
            // Create new profile
            profile = await Profile.create({
                user: req.user.id,
                name: value.name,
                cgpa: value.cgpa,
                profilePic: value.profilePic || '',
                skills: value.skills || [],
                projects: value.projects || 0
            });
        }

        await profile.populate('user', 'username email');
        res.status(201).send(profile);
    } catch (err) {
        res.status(500).send('Error creating/updating profile: ' + err.message);
    }
});

// Update profile
router.put('/', auth, async (req, res) => {
    try {
        const { error, value } = profileSchema_validate.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).send('Profile not found');

        profile.name = value.name;
        profile.cgpa = value.cgpa;
        profile.skills = value.skills || [];
        profile.projects = value.projects || 0;
        if (value.profilePic !== undefined) profile.profilePic = value.profilePic;
        
        // Score is recalculated by pre-save hook
        await profile.save();
        await profile.populate('user', 'username email');

        // Get updated rank
        const allProfiles = await Profile.find().sort({ score: -1 });
        const rank = allProfiles.findIndex(p => p.user.toString() === req.user.id) + 1;

        res.send({ ...profile.toObject(), rank, totalStudents: allProfiles.length });
    } catch (err) {
        res.status(500).send('Error updating profile: ' + err.message);
    }
});

// Get all profiles sorted by score (for leaderboard)
router.get('/leaderboard/all', async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('user', 'username email')
            .sort({ score: -1 });
        
        // Add rank to each profile
        const rankedProfiles = profiles.map((p, index) => ({
            ...p.toObject(),
            rank: index + 1
        }));

        res.send(rankedProfiles);
    } catch (err) {
        res.status(500).send('Error fetching profiles: ' + err.message);
    }
});

module.exports = router;
