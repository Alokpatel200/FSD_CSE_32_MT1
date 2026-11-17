const express=require('express');
const app=express();
const PORT=3000;
//middleware
app.use(express.json());
//initial student records
let students=[
    {
        id:201,
        rollNumber:21,
        name:"Shreya Sharma",
        branch:"CSE",
        semester:5,
        email:"shreya.sharma@example.com"
    },
    {
        id:202,
        rollNumber:22,
        name:"Rahul Verma",
        branch:"ECE",
        semester:3,
        email:"rahul.verma@example.com"
    },
    {
        id:203,
        rollNumber:23,
        name:"Anjali Singh",
        branch:"ME",
        semester:4,
        email:"anjali.singh@example.com"
    },
];
//to generate unique id for new student
let nextId=204;
//get all students
app.get("/api/students",(req,res)=>{
    res.status(200).json(students);
});
//add any new student
app.post("/api/students",(req,res)=>{
    const{rollNumber,name,branch,semester,email}=req.body;
    if(
        typeof rollNumber!=="string"|| !rollNumber.trim()||
        typeof name!=="string"|| !name.trim()||
        typeof branch!=="string"|| !branch.trim()||
        typeof semester!=="number"|| semester<=0||
        typeof email!=="string"|| !email.trim()
    ){
        return res.status(400).json({
            message:"Invalid student data. all fields are required."
        });
    }
    const newStudent={
        id:nextId++,
        rollNumber:rollNumber.trim(),
        name:name.trim(),
        branch:branch.trim(),
        semester:semester,
        email:email.trim()
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});
//get student by id
app.get("/api/students/:id",(req,res)=>{
    const Id=parseInt(req.params.id);
    const student=students.find(s=>s.id===Id);

    if(!student){
        return res.status(404).json({message:"Student not found."});
    }});



    res.status(200).json(student);

//update student by id
app.put("/api/students/:id",(req,res)=>{
    const Id=parseInt(req.params.id);
    const studentIndex=students.findIndex(s=>s.id===Id);
if(index===-1){
    return res.status(404).json({message:"Student not found."});
}
const{rollNumber,name,branch,semester,email}=req.body;
if(
    typeof rollNumber!=="string"|| !rollNumber.trim()||
    typeof name!=="string"|| !name.trim()||
    typeof branch!=="string"|| !branch.trim()||
    typeof semester!=="number"|| !Number.isFinite(semester)||
    typeof email!=="string"|| !email.trim()
){
    return res.status(400).json({
        message:"Invalid student data. all fields are required."
    });
}
student[index]={
    id:Id,
    rollNumber:rollNumber.trim(),
    name:name.trim(),
    branch:branch.trim(),
    semester:semester,
    email:email.trim()
};
res.status(200).json(students[index]);
});
//delete student by id
app.delete("/api/students/:id",(req,res)=>{
    const Id=parseInt(req.params.id);
    const studentIndex=students.findIndex(s=>s.id===Id);
    if(studentIndex===-1){
        return res.status(404).json({message:"Student not found."});
    }
    students.splice(studentIndex, 1);
    res.status(200).json({message:"Student deleted successfully."});
});

//filter student by branch
app.get("/api/students/filter",(req,res)=>{
    const branch=req.query.branch;
    if(typeof branch!=="string"|| !branch.trim()){
        return res.status(400).json({message:"Branch query parameter is required."});
    }
    const filteredStudents=students.filter(s=>s.branch.toLowerCase()===branch.trim().toLowerCase());
    res.status(200).json(filteredStudents);
});

//start the server
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);   
}); 
