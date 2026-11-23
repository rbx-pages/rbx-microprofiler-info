import React, { useState } from "react"
import { Link } from "react-router-dom";
import ModalLocalOpen from "./Base/Modals/ModalLocalOpen";
import SettingsPanel from "./SettingsPanel";

type Props = React.HTMLAttributes<HTMLElement> & {
    
}


function NavBar(props?: Props) {
    let [bSettingsOpen, setBoolSettingsOpen] = useState(false)

    return <>
    <nav id="nav_bar" {...props}>
        <ul>
            <li><Link to="/">MicroProfiler Info</Link></li>

            <div style={{
                marginLeft: "auto",
            }}>
                <li style={{
                    borderRight: "1px solid #808080"
                }}><a href="#"
                    onClick={function() {
                        setBoolSettingsOpen(!bSettingsOpen)
                    }}
                >Settings</a></li>
                <li><Link to="/about">About</Link></li>
            </div>
        </ul>
    </nav>

    {
        bSettingsOpen && <ModalLocalOpen
            onModalClose={() => setBoolSettingsOpen(false)}
            extraProps={{
                title: "Settings",
                enableBottomArea: false
            }}
        >
            <SettingsPanel
                onSaveButtonClicked={() => setBoolSettingsOpen(false)}
            />
        </ModalLocalOpen>
    }
    </>
}

export default NavBar;