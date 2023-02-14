const Job = require("../models/Job");
const getJournals = async (req, res) => {
    // res.send('get all journal')
    try{
        const jobs = await Job.find({ createdby: req.user.userId});
        res.status(200).json({noOfJobs: jobs.length, jobs});

    }catch
        (error){
            console.log(error);
            res.json({error})
    }
};

const getJournal = async (req, res) => {
    // res.send('get journal')
    //get access to the user, parameter
    // const {jobId} = req.params
    // const {userId} = req.user
    // const {user: {userId},} = req.user
    const {
        user: {userId},
        params:{jobId},
    } = req;
    try{
        const job = await Job.findOne({createdby:userId, jobId});
        if (!job){
        return res.status(404).json({success: false, message: `Journal with the ${jobId} not found.`});
        }
    }catch(error){
        console.log(error);
         res.json({error});
}};

const createJournals = async (req, res) => {
    // company, position, createdby
const {company, position} = req.body;
req.body.createdby = req.user.userId;
if(!company || !position){
    return res.status(400).json({
        success: false,
        message: "Please provide necessary information",
    });
}  

try{
    const job = await Job.create(req.body);
    res.status(201).json({success: true, job});
} catch(error){
    console.log(error);
    res.json({error});

    // res.send('create journal')
};
}

const updateJournal = async (req, res) => {
    // res.send('update journal')
    const {jobId} = req.params
    // const {company, position, password} = req.params
    try{
        const jobs = await Job.findOneAndUpdate({ createdby: req.user.userId, _id: jobId}, req.body, {new: true, runValidators: true});
        res.status(200).json({ jobs});

    }catch
        (error){
            console.log(error);
            res.json({error})
    }
};


    const deleteJournals = async (req, res) => {
    res.send('delete journal')
};
module.exports = {getJournal, createJournals, getJournals, updateJournal, deleteJournals}