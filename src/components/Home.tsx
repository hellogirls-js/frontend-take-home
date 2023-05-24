import { useContext, useEffect, useMemo, useState } from "react";
import FilterMenu from "../layout/FilterMenu";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IconArrowLeft, IconArrowRight, IconCake, IconDog, IconMapPin, IconStar } from "@tabler/icons-react";
import Select from "./utility/Select";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

/**
 * 
 * @param param0 a Dog object
 * @returns a JSX element representing a dog on the homepage grid
 */
function PuppyTile({ puppy }: { puppy: Dog }) {
  const SMALL_ICON = 20;
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selected) {

    } else {

    }
  }, [selected]);

  return (
    <div className="puppy-tile">
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
function createSortString(sort: Sort) {
  return `${sort.option}:${sort.descending ? "desc" : "asc"}`;
}

export default function Home() {
  const { user } = useContext(AuthContext) as Auth;
  const navigate = useNavigate();

  let unfilteredPuppies: Dog[] = [];
  let possibleBreeds: string[] = [];
  let zipcodes: string[] = [];
  let prevPageLink: string | undefined = undefined;
  let nextPageLink: string | undefined = undefined;

  const [filteredPuppies, setPuppies] = useState<Dog[]>(unfilteredPuppies);
  const [filteredBreeds, setBreeds] = useState<string[]>(possibleBreeds);
  const [filteredZipcodes, setZipcodes] = useState<string[]>(zipcodes);
  const [selectedPuppies, setSelected] = useState<Dog[]>([]);
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [from, setFrom] = useState<string | undefined | null>();
  const [sort, setSort] = useState<Sort>({
    option: "breed",
    descending: false
  });

  const params: SearchParams = useMemo(() => {
    return {
      size: 24,
      breeds: filteredBreeds,
      zipCodes: filteredZipcodes,
      sort: createSortString(sort),
      from: from,
      ageMin: minAge,
      ageMax: maxAge
   }
  }, [filteredBreeds, filteredZipcodes, sort, from, minAge, maxAge]) 

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
          console.log(res.data);
          setDogIds(res.data.resultIds);
          if (res.data.next) nextPageLink = res.data.next;
          if (res.data.prev) prevPageLink = res.data.prev;
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
  }, []);

  // set parameters
  useEffect(() => {
    fetchDogsIds(params);
  }, [params]);

  // update dogs when parameters are changed
  useEffect(() => {

  })

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

  if (!user) {
    navigate("/");
  }

  return (
    <div id="container">
      <FilterMenu />
      <div id="main-content">
        <div id="main-header">
          <h2 id="main-title">{user?.name}, find your perfect little puppy!</h2>
          <Select id="sort-select" label="Sort by" onChange={setSort} data={[
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
        <div id="puppy-grid">
          {filteredPuppies.map((puppy) => <PuppyTile puppy={puppy} key={puppy.id} />)}
        </div>
        <div id="pagination">
          {
            prevPageLink && (
              <div className="pagination-button" id="prev" aria-label="Previous" onClick={() => {
                const params = new URLSearchParams(`${BASE_URL}/${nextPageLink}`);
                const fromVal = params.get("from");
                setFrom(fromVal);
              }}>
                <div className="pagination-arrow"><IconArrowLeft /></div>
                <div className="pagination-text">Previous</div>
              </div>
            )
          }
          {
            nextPageLink && (
              <div className="pagination-button" id="next" aria-label="Next" onClick={() => {
                const params = new URLSearchParams(`${BASE_URL}/${nextPageLink}`);
                const fromVal = params.get("from");
                setFrom(fromVal);
              }}>
                <div className="pagination-arrow"><IconArrowRight /></div>
                <div className="pagination-text">Next</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}