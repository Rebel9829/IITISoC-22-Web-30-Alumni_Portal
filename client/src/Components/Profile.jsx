import React, { useEffect, useState } from "react";
import "./css/profile.css";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import NetworkCard from "./NetworkCard";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Dummy from "./images/Photo.jpeg";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useDispatch, useSelector } from 'react-redux';
import { successlogin } from "../actions";
import CloseIcon from '@mui/icons-material/Close';
import { joiningYears, graduateYears } from "./Arrays";

function Profile() {
    const state = useSelector(state => state.user);
    const user = state.user;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [image, setImage] = useState("");
    const [upimage, setupimage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState();
    const [formdata, setformdata] = useState({
        username: user.username,
        skills: (user.skills !== "" && user.skills != null) ? String(user.skills) : "",
        location: String(user.location),
        hometown: (user.hometown !== "" && user.hometown != null && user.hometown !== "undefined") ? String(user.hometown) : "",
        gender: String(user.gender),
        maritalStatus: String(user.marriageStatus),
        dob: new Date(user.dob),
        summary: (user.summary !== "" && user.summary != null && user.summary !== "undefined") ? String(user.summary) : "",
    });
    const [formdata1, setformdata1] = useState({
        username: user.username,
        workTitle: "",
        companyName: "",
        workIndustry: "",
        duration: "",
    });
    const [formdata2, setformdata2] = useState({
        username: user.username,
        instituteName: "",
        startYear: "",
        gradYear: "",
        degree: "",
        department: ""
    });
    useEffect(() => {
    }, [state]);

    async function handlePhoto(e) {
        e.preventDefault();
        if(image!=="") uploadImage();
    }

    const uploadImage = async () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "Alumni_preset")
        data.append("cloud_name", "harshit9829")
        await fetch("  https://api.cloudinary.com/v1_1/harshit9829/image/upload", {
            method: "post",
            body: data
        })
            .then(resp => resp.json())
            .then(data => {
                setupimage(data.url);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (upimage !== "") {
            try {
                Axios.post(
                    "http://localhost:8080/add-profile",
                    {username: user.username, file: upimage}
                ).then((response) => {
                    dispatch(successlogin(response.data));
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [upimage]);

    async function handleSubmit(e) {
        e.preventDefault();
        await Axios.post("http://localhost:8080/profile-data", formdata).then((response) => {
            dispatch(successlogin(response.data));
        });
    }
    async function handleSubmitWork(e) {
        e.preventDefault();
        await Axios.post("http://localhost:8080/profile-data-work", formdata1).then((response) => {
            dispatch(successlogin(response.data));
        });
        setformdata1({
            username: user.username,
            workTitle: "",
            companyName: "",
            workIndustry: "",
            duration: "",
        })
    }
    async function handleSubmitEducation(e) {
        e.preventDefault();
        await Axios.post("http://localhost:8080/profile-data-education", formdata2).then((response) => {
            dispatch(successlogin(response.data));
        });
        setformdata2({
            username: user.username,
            instituteName: "",
            startYear: "",
            gradYear: "",
            degree: "",
            department: ""
        })
    }

    const renderPhotos = (source) => {
        return <span><CloseIcon onClick={() => setSelectedFiles(null)} style={{ position: "absolute", zIndex: "1", margin: "5px", fontSize: "1em", backgroundColor: "white", cursor: "pointer" }} /><img src={source} alt="" key={source} /></span>;
    };

    return (
        <div className="profilePage">
            <div className="profileTopImg">
            </div>
            <div className="profilebottom">
                <div className="profileLeftNav">
                    <div className="profileLeftBox">
                        <div className="profImgTop">
                            <img src={(user.profile)?user.profile:Dummy} alt="" className="profileMainImg" />
                        </div>
                        <button class="changeImg" data-bs-toggle="modal" data-bs-target="#staticBackdrop0">Change Profile Image</button>
                        <div className="modal fade" id="staticBackdrop0" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <form onSubmit={handlePhoto}>
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="staticBackdropLabel">Change Profile Photo</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="add-event-image">
                                                <div className="add-event-photo">
                                                    <label style={{ height: "100%" }} htmlFor="add-photo">
                                                        <div><AddPhotoAlternateIcon style={{ fontSize: "85px", color: "white", backgroundColor: "green", margin: "5% auto 2%" }} /></div>
                                                        <input id="add-photo" name="file" onChange={(e) => { setImage(e.target.files[0]); setSelectedFiles(URL.createObjectURL(e.target.files[0])); URL.revokeObjectURL(e.target.files[0]); }} type="file" accept="image/*" />
                                                        Upload Photo
                                                    </label>
                                                </div>
                                                <div style={{ marginBottom: "5%", display: (selectedFiles) ? "block" : "none" }} className="gallery-add-result">{renderPhotos(selectedFiles)}</div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            <button type="submit" onClick={() => {navigate("/profile");}} className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <p id="ImgName"> {user.name} <i className="fa-solid fa-pen pen" onClick={() => navigate("/settings")}></i></p>
                        <p id="ImgText">{user.role}, Class of {user.yearOfGraduation}</p>
                        <p id="ImgText">{user.course} {user.department}</p>
                    </div>

                    <div className="profileLeftBox1">
                        <div className="leftBoxInfos">
                            <div className="infoCircle">
                                <span className="fas fa-info"></span>
                            </div>
                            <p id="leftBoxHeads" style={{ paddingTop: "4%" }}>Contact Information </p>
                            <button className="editBtn" onClick={() => navigate("/settings")}>Edit</button>
                        </div>
                        <div className="leftBoxSec">
                            <div className="leftBoxSecItem">
                                <span className="fas fa-envelope"></span>
                                <p id="leftBoxSubHead">{user.email}</p>
                            </div>
                            <div className="leftBoxSecItem">
                                <span className="fas fa-phone"></span>
                                <p id="leftBoxSubHead">{user.phone}</p>
                            </div>
                            <div className="leftBoxSecItem">
                                <span className="fas fa-paperclip"></span>
                                <p id="leftBoxSubHeadLink">https://alumni.iiti.ac.in/profile/{user._id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="profileLeftBox2">
                        <div className="leftBoxInfos">
                            <div className="infoCircle">
                                <span className="fas fa-info"></span>
                            </div>
                            <p id="leftBoxHeads" style={{ paddingTop: "4%" }}>Expertise</p>
                            <button className="editBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop1">Edit</button>
                            <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="staticBackdropLabel">Expertise</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="email_11" >
                                                    <div>
                                                        <p className="ip11" >
                                                            <p className="para11">Skills:</p>
                                                            <input type="text" value={formdata.skills} name="skills" onChange={(e) => setformdata({ ...formdata, skills: e.target.value })} className="textskills" placeholder="Add Skills" />
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="leftBoxSec">
                            <p style={{ fontSize: "15px" }}>Skills: {(user.skills) ? user.skills : ""}</p>
                        </div>
                    </div>

                    <div className="profileLeftBox3">
                        <div className="leftBoxInfos">
                            <div className="infoCircle">
                                <span className="fas fa-info"></span>
                            </div>
                            <p id="leftBoxHeads" style={{ paddingTop: "4%" }}>Basic Information</p>
                            <button className="editBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop3">Edit</button>
                            <div className="modal fade" id="staticBackdrop3" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div style={{ width: "800px" }} className="modal-content">
                                        <form onSubmit={handleSubmit}>
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="staticBackdropLabel">Expertise</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="email_11" >
                                                    <div>
                                                        <p className="ip1000">
                                                            <label htmlFor="sender_name">Current Location*</label>
                                                            <br />
                                                            <input type="text" value={formdata.location} onChange={(e) => setformdata({ ...formdata, location: e.target.value })} name="location" id="sender_name" />
                                                        </p>
                                                        <p className="ip1000">
                                                            <label htmlFor="sender_name">Hometown*</label>
                                                            <br />
                                                            <input type="text" value={formdata.hometown} onChange={(e) => setformdata({ ...formdata, hometown: e.target.value })} name="hometown" id="sender_name" />
                                                        </p>
                                                        <p className="ip11" >
                                                            <label htmlFor="send_from">Gender *</label>
                                                            <br />
                                                            <select name="gender" onChange={(e) => setformdata({ ...formdata, gender: e.target.value })} id="send_from">
                                                                <option value="" defaultChecked hidden>Select Gender</option>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Others">Others</option>
                                                            </select>
                                                        </p>
                                                        <p className="ip11" >
                                                            <label htmlFor="send_from">Marital Status *</label>
                                                            <br />
                                                            <select name="maritalStatus" onChange={(e) => setformdata({ ...formdata, maritalstatus: e.target.value })} id="send_from">
                                                                <option value="" defaultChecked hidden>Select Marital Status</option>
                                                                <option value="Married">Married</option>
                                                                <option value="Unmarried">Unmarried</option>
                                                            </select>
                                                        </p>
                                                        <p className="ip11" >
                                                            <label htmlFor="send_from">Date of Birth *</label>
                                                            <br />
                                                            <div className="sender_name"><DatePicker name="dob" wrapperClassName="hellobro1" dateFormat="yyyy/MM/dd" selected={formdata.dob} onChange={(date) => setformdata({ ...formdata, dob: date })} /></div>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="leftBoxSec">
                            <div className="leftBoxSecItem">
                                <span className="fa-solid fa-location-dot" style={{ marginRight: "1.5%" }}></span>
                                <p id="leftBoxSubHeadLink2">{user.location}</p>
                            </div>
                            <div className="leftBoxSecItem">
                                <span className="fas fa-home"></span>
                                <p id="leftBoxSubHeadLink2">{(user.hometown) ? user.hometown : ""}</p>
                            </div>
                            <div className="leftBoxSecItem">
                                <span className="fa-solid fa-cake-candles"></span>
                                <p id="leftBoxSubHead" style={{ marginLeft: "42px" }}>{user && (user.dob.substring(0, 8) + new Date(user.dob).getDate())}</p>
                            </div>
                            <div className="leftBoxSecItem">
                                <span className="fa-solid fa-user"></span>
                                <p id="leftBoxSubHead" style={{ marginLeft: "44px" }}>{user.gender}</p>
                            </div>
                            <div className="leftBoxSecItem">
                                <span className="fa-solid fa-user-group"></span>
                                <p id="leftBoxSubHead" style={{ marginLeft: "36px" }}>{user.marriageStatus}</p>
                            </div>
                        </div>
                    </div>

                    <div className="profileLeftBox4">
                        <div className="leftBoxInfos">
                            <div className="infoCircle">
                                <span className="fas fa-info"></span>
                            </div>
                            <p id="leftBoxHeads" style={{ paddingTop: "4%" }}>Network </p>
                        </div>
                        <div className="leftBoxSec2">
                            {
                                (user.network == null || user.network && user.network.length === 0) ? (<p id="leftBoxSubHead2"> <i className="fa-solid fa-circle-plus big"></i> Add IIT Indore friends and
                                    contacts to your growing network.</p>) : user.network.map((inf, index) => <div><NetworkCard key={index} name={inf.name} status={inf.status} year={inf.yearOfJoining} /></div>)
                            }
                        </div>
                    </div>
                </div>
                <div className="profileRightNav">
                    <div className="profileRightBox">
                        <div className="rightBoxInfos">
                            <div className="infoCircle2">
                                <span className="fa-solid fa-clipboard-user"></span>
                            </div>
                            <p id="leftBoxHeads">Summary </p>
                            <button className="editBtn2" data-bs-toggle="modal" data-bs-target="#staticBackdrop4">+Add</button>
                            <div className="modal fade" id="staticBackdrop4" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="staticBackdropLabel">Summary</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="email_11" >

                                                    <div>
                                                        <p className="ip1001">
                                                            <label >Add summary</label>
                                                            <br />
                                                            <p className="ip400">
                                                                <textarea id="email_text" value={formdata.summary} onChange={(e) => setformdata({ ...formdata, summary: e.target.value })} rows="8" cols="59" name="summary" placeholder="Type you text here"></textarea>
                                                            </p>
                                                        </p>

                                                    </div>

                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="rightBoxSec2">
                            <p className="rightBoxSubHead2" style={{ fontSize: "16px", display: (user.summary === null || user.summary === "") ? "block" : "none" }}> <i className="fa-solid fa-circle-plus big"></i> Use summary to share what
                                you do, your achievements or the opportunities you're looking for.</p>
                            <div style={{ display: (user.summary === "undefined" || user.summary === null || user.summary === "") ? "none" : "block" }}>{(user.summary) ? user.summary : ""}</div>
                        </div>
                    </div>
                    <div className="profileRightBox">
                        <div className="rightBoxInfos">
                            <div className="infoCircle2">
                                <span className="fa-solid fa-bag-shopping"></span>
                            </div>
                            <p id="leftBoxHeads">Work Experience </p>
                            <button className="editBtn2" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">+Add Work</button>
                            <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <form onSubmit={handleSubmitWork}>
                                        <div style={{ width: "750px" }} className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="staticBackdropLabel">Add Work</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="email_11" >
                                                    <div>
                                                        <p className="ip1000">
                                                            <label htmlFor="sender_name">Work Title*</label>
                                                            <br />
                                                            <input type="text" value={formdata1.workTitle} onChange={(e) => setformdata1({ ...formdata1, workTitle: e.target.value })} name="sender_name" id="sender_name" />
                                                        </p>
                                                        <p className="ip1000">
                                                            <label htmlFor="sender_name">Company Name*</label>
                                                            <br />
                                                            <input type="text" value={formdata1.companyName} onChange={(e) => setformdata1({ ...formdata1, companyName: e.target.value })} name="sender_name" id="sender_name" />
                                                        </p>
                                                        <p className="ip1000">
                                                            <label htmlFor="sender_name">Work Industry*</label>
                                                            <br />
                                                            <input type="text" value={formdata1.workIndustry} onChange={(e) => setformdata1({ ...formdata1, workIndustry: e.target.value })} name="sender_name" id="sender_name" />
                                                        </p>
                                                        <p className="ip1000">
                                                            <label htmlFor="sender_name">Duration*</label>
                                                            <br />
                                                            <input type="text" value={formdata1.duration} onChange={(e) => setformdata1({ ...formdata1, duration: e.target.value })} name="sender_name" id="sender_name" />
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                <button type="submit" onClick={() => navigate("/profile")} className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="rightBoxSec2">
                            <p className="rightBoxSubHead2" style={{ display: user.workExperience && (user.workExperience.length === 0) ? "block" : "none" }}> <i className="fa-solid fa-circle-plus big"></i> Share your work history to
                                enhance your networking potential.</p>
                            <div>{
                                user.workExperience && user.workExperience.map((work, index) => {
                                    return (
                                        <div key={index} className="workexp">
                                            <div className="jobtitle">{work.workTitle}</div>
                                            <div className="company">{work.companyName}</div>
                                            <div className="duration">{work.duration} ({work.workIndustry})</div>
                                            <div className="penButton">
                                                <i className="fa-solid fa-pen pen"></i>
                                            </div>
                                        </div>
                                    )
                                })
                            }</div>
                        </div>
                    </div>
                    <div className="profileRightBox3">
                        <div className="rightBoxInfos">
                            <div className="infoCircle2">
                                <span className="fa-solid fa-book"></span>
                            </div>
                            <p id="leftBoxHeads">Education</p>
                            <button className="editBtn2" data-bs-toggle="modal" data-bs-target="#staticBackdrop5">+Add Education</button>
                            <div className="modal fade" id="staticBackdrop5" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <form onSubmit={handleSubmitEducation}>
                                        <div style={{ width: "600px" }} className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="staticBackdropLabel">Education</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="email_11" >

                                                    <div>

                                                        <div className="nameOfInstitute">
                                                            <input type="text" value={formdata2.instituteName} onChange={(e) => setformdata2({ ...formdata2, instituteName: e.target.value })} placeholder="Name of the Institute" />
                                                        </div>
                                                        <div className="startEndYear">
                                                            <div className="boxx" style={{ width: "200px", border: "0", margin: "15px 1px" }}><Select name="joining" onChange={(option) => setformdata2({ ...formdata2, startYear: option.value })} placeholder="Start Year" options={joiningYears} /></div>
                                                            <div className="boxx" style={{ width: "200px", border: "0", margin: "15px 0px 15px 30px" }}><Select name="graduation" onChange={(option) => setformdata2({ ...formdata2, gradYear: option.value })} placeholder="End Year" options={graduateYears} /></div>
                                                        </div>
                                                        <div className="degreeDepartment">
                                                            <input type="text" value={formdata2.degree} onChange={(e) => setformdata2({ ...formdata2, degree: e.target.value })} className="degree" placeholder="Degree" />
                                                            <input type="text" value={formdata2.department} onChange={(e) => setformdata2({ ...formdata2, department: e.target.value })} className="department" placeholder="Department" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                <button type="submit" onClick={() => navigate("/profile")} className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="righteducate">
                            {user.education && user.education.map((edu, index) => {
                                return (<div key={index} className="educateCover">
                                    <div className="educateContent">
                                        <p id="ImgName2">{edu.instituteName}</p>
                                        <p id="ImgText2">{edu.degree} {edu.department} {edu.startYear}-{edu.gradYear}</p>
                                    </div>
                                    <div className="penButton">
                                        <i className="fa-solid fa-pen pen"></i>
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                    <div className="profileRightBox4">
                        No more updates to display.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;