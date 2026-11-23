import SiteConfig from "../js/modules/SiteConfig";

function AboutPage() {
    return <>
        {/* Title change */}
        <head>
            <title>MicroProfiler Info - About</title>
        </head>

        <div className="page-about">
            <header>
                <h1>About</h1>
            </header>
            
            <main>
                <section>
                    <h2>Q & A</h2>
                    <h3>Why are the "tag names" called Tokens?</h3>
                    <p>
                        Because of <code>RBX::Profiler::getToken(group, name, color)</code>.
                        The names do not necessarily reflect the namespace in C++.
                        Navigation::rasterizeTile, would be Navigation as group, yet it doesn't.
                    </p>
                </section>
            </main>

            <footer>
                <nav>
                    <a className="noStyle" href={SiteConfig.repo_URL} target="_blank">GitHub</a>
                    <a className="noStyle" href="https://roblox.com" target="_blank">Roblox</a>
                </nav>
                <div className="footer-sideContainer">
                    <span className="license">
                        CC BY-SA 4.0, Attribution-ShareAlike 4.0 International
                    </span>
                    <span className="publication">
                        karl-police
                    </span>
                </div>
            </footer>
        </div>
    </>
}


export default AboutPage;