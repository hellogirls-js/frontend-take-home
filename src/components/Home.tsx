import { useContext, useEffect, useMemo, useState } from "react";
import FilterMenu from "../layout/FilterMenu";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IconArrowLeft, IconArrowRight, IconCake, IconDog, IconMapPin, IconStar } from "@tabler/icons-react";
import Select from "./utility/Select";
import MatchButton from "../layout/MatchButton";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

/**
 * 
 * @param param0 a Dog object
 * @returns a JSX element representing a dog on the homepage grid
 */
function PuppyTile(
  { 
    puppy, 
    addSelected, 
    alreadySelected, 
    location 
  }: 
  { 
    puppy: Dog; 
    addSelected: React.Dispatch<React.SetStateAction<string[]>>; 
    alreadySelected: string[];
    location: Location;
  }) {
  const SMALL_ICON = 20;
  const [selected, setSelected] = useState<boolean>(false);

  // select a dog
  useEffect(() => {
    if (selected) {
      if (!alreadySelected.includes(puppy.id)) {
        addSelected([...alreadySelected, puppy.id]);
      }
    } else {
      if (alreadySelected.includes(puppy.id)) {
        let idIndex = alreadySelected.indexOf(puppy.id);
        let newArr = alreadySelected.splice(idIndex, 1);
        addSelected(newArr);
      }
    }
  }, [selected]);

  return (
    <div className="puppy-tile">
      <div className="puppy-info-location">
        <div className="puppy-info-icon">
          <IconMapPin size={SMALL_ICON} />
        </div>
        <div className="puppy-info-text">
          {location && location.city && location.state ? `${location.city}, ${location.state}` : puppy.zip_code}
        </div>
      </div>
      <div className="puppy-tile-img">
        <img src={puppy.img} alt={puppy.name} />
      </div>
      <div className="puppy-tile-info">
        <div className="puppy-tile-info-heading">
          <h3>{puppy.name}</h3>
          <div className={`puppy-tile-star ${selected ? "selected" : "default"}`} onClick={() => { setSelected(!selected) }}>
            <IconStar size={28} fill={selected ? "currentColor" : "none"} />
          </div>
        </div>
        <div className="puppy-info-basic">
          <div className="puppy-tile-info-sec">
            <div className="puppy-info-icon">
              <IconDog size={SMALL_ICON} strokeWidth={1} />
            </div>
            <div className="puppy-info-text">
              {puppy.breed}
            </div>
          </div>
          <div className="puppy-tile-info-sec">
            <div className="puppy-info-icon">
              <IconCake size={SMALL_ICON} strokeWidth={1} />
            </div>
            <div className="puppy-info-text">
              {puppy.age} {puppy.age === 1 ? "year" : "years"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SearchParams {
  size?: number;
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  from?: string | null;
  sort?: string;
}

/**
 * 
 * @param {Sort} option the sort option [breed, name, age]
 * @param {boolean} descending - whether to sort descending or not
 * @returns a string formatted for a search parameter
 */
function createSortString(option: string, descending: boolean) {
  return `${option === "" ? "breed" : option}:${descending ? "desc" : "asc"}`;
}

export default function Home() {
  const { user } = useContext(AuthContext) as Auth;
  const navigate = useNavigate();
  let unfilteredPuppies: Dog[] = [];
  let zipcodes: string[] = [];

  // state variables
  const [filteredPuppies, setPuppies] = useState<Dog[]>(unfilteredPuppies);
  const [possibleBreeds, setPossibleBreeds] = useState<string[]>([]);
  const [filteredBreeds, setBreeds] = useState<string[]>([]);
  const [filteredZipcodes, setZipcodes] = useState<string[]>(zipcodes);
  const [currentZipcodes, setCurrentZipcodes] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedPuppies, setSelected] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [prevPageLink, setPrev] = useState<string | undefined>();
  const [nextPageLink, setNext] = useState<string | undefined>();
  const [from, setFrom] = useState<string | undefined | null>();
  const [sortOption, setSortOption] = useState<string>("breed");
  const [isSortDescending, setDescending] = useState<boolean>(false);

  /**
   * 
   * @param param0 pagination props
   * @returns {JSX.Element} pagination
   */
  function Pagination(
    { 
      prevLink, 
      nextLink,
    }: 
    { 
      prevLink?: string; 
      nextLink?: string;
    }) {
    return (
      <div className="pagination">
        <div className={`pagination-button prev ${prevPageLink ? "visible" : "hidden"}`} aria-label="Previous" onClick={() => {
          const params = new URLSearchParams(`${BASE_URL}/${prevLink}`);
          const fromVal = params.get("from");
          setFrom(fromVal);
        }}>
          <div className="pagination-arrow"><IconArrowLeft /></div>
          <div className="pagination-text">Previous</div>
        </div>
        <div className={`pagination-button next ${nextPageLink ? "visible" : "hidden"}`} aria-label="Next" onClick={() => {
          const params = new URLSearchParams(`${BASE_URL}/${nextLink}`);
          const fromVal = params.get("from");
          setFrom(fromVal);
        }}>
          <div className="pagination-text">Next</div>
          <div className="pagination-arrow"><IconArrowRight /></div>
        </div>
      </div>
    );
  }

  const params: SearchParams = useMemo(() => {
    return {
      size: 24,
      breeds: filteredBreeds,
      zipCodes: filteredZipcodes,
      sort: createSortString(sortOption, isSortDescending),
      from: from,
      ageMin: minAge,
      ageMax: maxAge
   }
  }, [filteredBreeds, filteredZipcodes, sortOption, isSortDescending, from, minAge, maxAge]);
  
  /**
   * fetch all dog breeds
   */
  const fetchBreeds = async () => {
    await axios.get(`${BASE_URL}/dogs/breeds`, {
      withCredentials: true
    }).then((res) => {
      if (res.status === 200) {
        setPossibleBreeds(res.data);
      } else {
        throw new Error("Could not retrieve dog breeds");
      }
    }).catch(error => {
      throw new Error(`Could not retrieve dog breeds: ${error}`)
    });
  }

  /**
   * 
   * @param {SearchParams} params parameters needed to refine search results
   */
  const fetchDogsIds = async (params?: SearchParams) => {
    try {
      await axios.get(`${BASE_URL}/dogs/search`, {
        params: params,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        withCredentials: true,
      }).then((res) => {
        if (res.status === 200) {
          setDogIds(res.data.resultIds);
          if (res.data.next) {
            setNext(res.data.next);
          } else {
            setNext(undefined);
          }

          if (res.data.prev) {
            setPrev(res.data.prev);
          } else {
            setPrev(undefined);
          }
        } else {
          navigate("/login");
        }
      }).catch((error) => {
        navigate("/login");
      })
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // fetch the necessary dog ids on load
  useEffect(() => {
    fetchDogsIds();
    fetchBreeds();
  }, []);

  // update dogs when parameters are changed
  useEffect(() => {
    console.log(filteredBreeds)
    fetchDogsIds(params);
  }, [params]);

  // fetch the dogs that correspond to the ids
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        await axios.post(`${BASE_URL}/dogs`, dogIds, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          withCredentials: true,
        }).then((res) => {
          if (res.status === 200) {
            unfilteredPuppies = res.data;
            setPuppies(res.data);
            setCurrentZipcodes((res.data as Dog[]).map((puppy: Dog) => puppy.zip_code));
          } else {
            throw new Error("Could not retireve puppies :(");
          }
        }).catch((error) => {
          throw new Error(`Could not retrieve puppies: ${error}`)
        })
      } catch (error) {
        throw new Error(`${error}`);
      }
    }

    fetchDogs();
  }, [dogIds]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        await axios.post(`${BASE_URL}/locations`, currentZipcodes, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          withCredentials: true,
        }).then((response) => {
          if (response.status === 200) {
            setLocations(response.data);
          } else {
            throw new Error("Could not load location");
          }
        }).catch((error) => {
          throw new Error(`Could not load location data: ${error}`)
        });
      } catch (error) {
        throw new Error(`Could not load location data: ${error}`);
      }
    }

    fetchLocations();
  }, [currentZipcodes]);



  if (!user) {
    navigate("/");
  }

  return (
    <div id="container">
      <FilterMenu breedData={possibleBreeds} onBreedChange={setBreeds} currentBreeds={filteredBreeds} />
      <div id="main-content">
        <div id="main-header">
          <h2 id="main-title">{user?.name}, find your perfect little puppy!</h2>
          <Select id="sort-select" label="Sort by" onChange={setSortOption} data={[
            {
              label: "Breed",
              value: "breed"
            },
            {
              label: "Name",
              value: "name"
            },
            {
              label: "Age",
              value: "age"
            }
          ]} />
        </div>
        <Pagination prevLink={prevPageLink} nextLink={nextPageLink} />
        <div id="puppy-grid">
          {filteredPuppies.map((puppy, index) => <PuppyTile puppy={puppy} key={puppy.id} addSelected={setSelected} alreadySelected={selectedPuppies} location={locations[index]} />)}
        </div>
        <Pagination prevLink={prevPageLink} nextLink={nextPageLink} />
      </div>
      <MatchButton />
    </div>
  );
}