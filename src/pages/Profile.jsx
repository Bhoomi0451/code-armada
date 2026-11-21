import { useState } from "react";
import { Link } from "react-router-dom";

import {
    User,
    Swords,
    Trophy,
    BrainCircuit,
    ArrowLeft,
    Edit3,
    Save,
    Target
} from "lucide-react";

import "../App.css";

function Profile() {

    const [name, setName] = useState("Kirti");

    const [editing, setEditing] = useState(false);

    const [editName, setEditName] = useState(name);


    const handleSave = () => {

    if (editName.trim()) {

        setName(editName.trim());

        setEditing(false);

    }

};


return (

    <div className="profile-page">

        {/* PROFILE HEADER */}

        <header className="profile-header">

            <Link to="/dashboard" className="profile-back">
                <ArrowLeft size={20}/>
                Dashboard
            </Link>

            <h2>My Profile</h2>

        </header>


        <main className="profile-content">

            {/* PROFILE HERO */}

            <section className="profile-hero">

                <div className="profile-avatar">
                    {name.charAt(0).toUpperCase()}
                </div>

                <h1>{name}</h1>

                <p>Code Armada Member</p>

                <span className="profile-league">
                    Gold League
                </span>

            </section>


            {/* PROFILE STATISTICS */}

            <section className="profile-stats">

                <div className="profile-stat-card">

                    <Swords size={24}/>

                    <h2>48</h2>

                    <p>Total Battles</p>

                </div>


                <div className="profile-stat-card">

                    <Trophy size={24}/>

                    <h2>1450</h2>

                    <p>Current Rating</p>

                </div>


                <div className="profile-stat-card">

                    <BrainCircuit size={24}/>

                    <h2>AI Interview</h2>

                    <p>Interview Practice</p>

                </div>

            </section>


            {/* PERSONAL INFORMATION */}

            <section className="profile-details">

                <div className="profile-section-heading">

                    <h2>Personal Information</h2>

                    {!editing ? (

                        <button onClick={() => {
                            setEditName(name);
                            setEditing(true);
                        }}>

                            <Edit3 size={16}/>
                            Edit Profile

                        </button>

                    ) : (

                        <button onClick={handleSave}>

                            <Save size={16}/>
                            Save

                        </button>

                    )}

                </div>


                <div className="profile-field">

                    <label>Full Name</label>

                    {editing ? (

                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Enter your name"
                        />

                    ) : (

                        <p>{name}</p>

                    )}

                </div>


                <div className="profile-field">

                    <label>Platform</label>

                    <p>Code Armada</p>

                </div>


                <div className="profile-field">

                    <label>Current League</label>

                    <p>Gold League</p>

                </div>

            </section>


            {/* ACHIEVEMENTS */}

            <section className="profile-achievements">

                <Trophy size={25}/>

                <div>

                    <h3>Achievements</h3>

                    <p>Gold League Member · 1450 Rating</p>

                </div>

            </section>

        </main>

    </div>

);

}

export default Profile;