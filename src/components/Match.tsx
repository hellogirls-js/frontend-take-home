import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider";
import { IconCake, IconDog, IconHeartFilled, IconMapPin } from "@tabler/icons-react";
import Button from "./utility/Button";
import axios from "axios";

export default function Match() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) as Auth;
  const [match, setMatch] = useState<Dog>();
  const [location, setLocation] = useState<Location>();
  const BASE_URL = "https://frontend-take-home-service.fetch.com";

  if (!id) {
    navigate("/");
  }

  if (!user) {
    navigate("/login");
  }

  const fetchMatch = async () => {
    try {
      await axios.post(`${BASE_URL}/dogs`, [id], {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }).then((res) => {
        if (res.status === 200) {
          setMatch(res.data[0])
        } else {
          navigate("/");
        }
      }).catch(() => navigate("/"));
    } catch {
      navigate("/");
    }
  }

  const fetchLocation = async () => {
    try {
      await axios.post(`${BASE_URL}/locations`, [match?.zip_code], {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        withCredentials: true,
      }).then((response) => {
        if (response.status === 200) {
          setLocation(response.data[0]);
        } else {
          setLocation(undefined);
        }
      }).catch((error) => {
        setLocation(undefined);
      });
    } catch (error) {
      setLocation(undefined);
    }
  }

  useEffect(() => {
    fetchMatch();
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [match]);

  return (
    <div id="match-container">
      <div id="match-header">
        <h2>{user && user.name}, we found your perfect dog!</h2>
      </div>
      <div id="match-info">
        <div id="match-img" style={{ backgroundImage: `url(${match?.img})`}}>
        </div>
        <div id="match-summary">
          <h3>Meet {match?.name}!</h3>
          <div id="match-buttons">
            <div className="match-button">
              <Button id="love" label="So cute!" />
            </div>
            <div className="match-button">
              <Button id="indifferent" label="Back to home" onClick={() => { navigate("/") }}/>
            </div>
          </div>
          <h4>Things to know about {match?.name}...</h4>
          <div className="match-point" id="breed">
            <div className="match-point-icon" aria-label="Breed">
              <IconDog />
            </div>
            <div className="match-point-text">
              {match?.breed}
            </div>
          </div>
          <div className="match-point" id="breed">
            <div className="match-point-icon" aria-label="Age">
              <IconCake />
            </div>
            <div className="match-point-text">
              {match?.age} {match?.age === 1 ? "year" : "years"} old
            </div>
          </div>
          <div className="match-point" id="breed">
            <div className="match-point-icon" aria-label="Location">
              <IconMapPin />
            </div>
            <div className="match-point-text">
              <Link 
                to={location 
                  ? `https://www.google.com/maps/search/?api=1&query=${location.latitude}%2C${location.longitude}` 
                  : `https://www.google.com/maps/search/?api=1&query=${match?.zip_code}`
                }
                target="_blank"
              >
                {location ? `${location.city}, ${location.state}` : match?.zip_code}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div id="match-heart">
        <IconHeartFilled size={300} />
      </div>
    </div>
  )
}