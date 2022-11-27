import Copyright from "./Copyright";

export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <div id="splash-screen-heading">
                Welcome to Playlister

            </div>
            <div id="splash-screen-description">
                Be able to create your own playlist <br />
                View playlists created by others and listen to songs made by you and others.
            </div>

            <Copyright />
        </div>
    )
}