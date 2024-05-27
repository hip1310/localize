import { useState, useEffect } from "react";
import axiosAPI from "../service/axiosAPI";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

interface PhaseData {
  id?: number;
  phrase?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  translations?: {
    es?: string;
    fr?: string;
  };
}

const Phase: React.FC = () => {
  const [id, setId] = useState<number | "">(1);
  const [language, setLanguage] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt:asc");
  const [phaseDataList, setPhaseDataList] = useState<PhaseData[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let url = "/phrase/";
      if (id && language) {
        url += `${id}/${language}`;
      } else if (id) {
        url += `${id}`;
      } else if (search && sortBy) {
        url += `search?query=${search}&sortBy=${sortBy}`;
      }

      if (url !== "/phrase/") {
        const response = await axiosAPI.get(url);
        let data = await response?.data;

        if (response?.status === 200) {
          if (id && language && (language === "es" || language === "fr")) {
            const phaseData = {
              translations: {
                [language]: data,
              },
            };
            setPhaseDataList([phaseData]);
          } else {
            if (!Array.isArray(data)) {
              data = [data];
            }

            setPhaseDataList(data);
          }
        } else {
          setPhaseDataList([]);
        }
      }
    } catch (error) {
      console.error("Error fetching phase data:", error);
    }
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (event.target.value && !isNaN(value)) {
      setId(value);
      setSearch("");
    } else if (!event.target.value) {
      setId("");
      setSearch("");
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
    setSearch("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setId("");
    setLanguage("");
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  return (
    <div className="mt-20 ml-2 mr-2">
      <div className="flex">
        <TextField
          label="Id"
          value={id}
          onChange={handleIdChange}
          variant="outlined"
        />
        <TextField
          className="!ml-2"
          label="Language"
          value={language}
          onChange={handleLanguageChange}
          variant="outlined"
        />
        <TextField
          className="!ml-2"
          label="Search"
          value={search}
          onChange={handleSearchChange}
          variant="outlined"
        />
        <FormControl className="w-50">
          <InputLabel id="sortby-label">Sort By</InputLabel>
          <Select
            value={sortBy}
            className="!ml-2"
            label="Sort By"
            onChange={handleSortByChange}
            labelId="sortby-label"
            variant="outlined"
          >
            <MenuItem value={"id:asc"}>Id Asc</MenuItem>
            <MenuItem value={"id:desc"}>Id desc</MenuItem>
            <MenuItem value={"status:asc"}>Status Asc</MenuItem>
            <MenuItem value={"status:desc"}>Status desc</MenuItem>
            <MenuItem value={"createdAt:asc"}>Created Date Asc</MenuItem>
            <MenuItem value={"createdAt:desc"}>Created Date desc</MenuItem>
            <MenuItem value={"updatedAt:asc"}>Updated Date Asc</MenuItem>
            <MenuItem value={"updatedAt:desc"}>Updated Date desc</MenuItem>
          </Select>
        </FormControl>
        <Button
          className="!ml-2 !bg-black"
          onClick={fetchData}
          variant="contained"
        >
          Submit
        </Button>
      </div>

      <div className="mt-5">
        {phaseDataList?.map((phaseData) => {
          return (
            <div
              key={phaseData?.id}
              className="bg-slate-600 text-white rounded p-4 mt-5"
            >
              {phaseData.id && <h2>Phase ID: {phaseData.id}</h2>}
              {phaseData.phrase && <p>Phase: {phaseData.phrase}</p>}
              {phaseData.status && <p>Status: {phaseData.status}</p>}
              {phaseData.createdAt && <p>Created At: {phaseData.createdAt}</p>}
              {phaseData.updatedAt && <p>Updated At: {phaseData.updatedAt}</p>}
              {phaseData?.translations && (
                <div>
                  {phaseData.translations.es && (
                    <p>Spanish: {phaseData.translations.es}</p>
                  )}
                  {phaseData.translations.fr && (
                    <p>French: {phaseData.translations.fr}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {phaseDataList === null && <p>Loading phase data...</p>}
        {phaseDataList?.length === 0 && <p>No phase data found</p>}
      </div>
    </div>
  );
};

export default Phase;
