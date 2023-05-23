import { useContext, useEffect, useState } from "react";
import FilterMenu from "../layout/FilterMenu";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout } = useContext(AuthContext) as Auth;
  const navigate = useNavigate();
  let unfilteredPuppies: Dog[] = [];
  let possibleBreeds: string[] = [];
  let zipcodes: string[] = [];

  const [filteredPuppies, setPuppies] = useState<Dog[]>(unfilteredPuppies);
  const [filteredBreeds, setBreeds] = useState<string[]>(possibleBreeds);
  const [filteredZipcodes, setZipcodes] = useState<string[]>(zipcodes);
  const [selectedPuppies, setSelected] = useState<Dog[]>([]);
  const [dogIds, setDogIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        await fetch("https://frontend-take-home-service.fetch.com/dogs/search?" + new URLSearchParams({
          size: '100'
        }).toString(), {
          method: "GET",
          headers: {
            "content-type": "application/json;charset=UTF-8"
          },
          credentials: "include",
        }).then((res) => {
          res.json().then((data) => {
            setDogIds(data.resultIds);
          console.log(dogIds);
          }).catch((error) => {
            console.error("An error occured: ", error);
          })
        })
      } catch (error) {
        throw new Error(`${error}`);
      }
    }

    fetchDogs();
  }, [user]);

  if (!user) {
    navigate("/");
  }

  return (
    <div id="container">
      <FilterMenu />
      <main id="main-content">
        <h2 id="main-title">{user?.name}, find your perfect little puppy!</h2>
        <div id="puppy-grid">

        </div>
      </main>
    </div>
    
  );
}