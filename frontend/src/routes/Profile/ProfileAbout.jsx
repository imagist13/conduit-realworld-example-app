import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import getProfile from "../../services/getProfile";

function ProfileAbout() {
  const { state } = useLocation();
  const { username } = useParams();
  const { headers } = useAuth();
  const [bio, setBio] = useState(state?.bio || "");

  useEffect(() => {
    if (!bio && username) {
      getProfile({ headers, username })
        .then(({ bio }) => setBio(bio || ""))
        .catch(console.error);
    }
  }, [username, headers, bio]);

  if (!bio) {
    return (
      <div className="article-preview">
        <em>{username} hasn't added a bio yet.</em>
      </div>
    );
  }

  return (
    <div className="about-me-section">
      <Markdown options={{ forceBlock: true }}>{bio}</Markdown>
    </div>
  );
}

export default ProfileAbout;
