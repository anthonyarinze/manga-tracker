import styled from "styled-components";
import { useTitleDetails } from "../api/useTitleDetails";
import Spinner from "../ui/Spinner";
import { useParams } from "react-router-dom";
import Heading from "../ui/Heading";
import { FaBookmark, FaExternalLinkAlt, FaStar } from "react-icons/fa";
import {
  capitalizeFirstLetter,
  formatFavorites,
  handleClickTitle,
  handleShareButtonClick,
} from "../utils/helpers";
import { IoBookmarksOutline, IoShareOutline } from "react-icons/io5";
import { MdBookmarkAdded } from "react-icons/md";
import TitleButton from "../ui/TitleButton";
import { useEffect } from "react";
import Modal from "../ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import { currentTitle } from "../slices/titleSlice";
import { setTitles } from "../slices/librarySlice";
import { openModal } from "../slices/modalSlice";
import { addToHistory } from "../slices/historySlice";
import RecommendationsById from "../components/RecommendationsById";
import MangaRecommendationsById from "../components/MangaRecommendationsById";
import { useGetLibrary } from "../api/useGetLibrary";

const StyledSection = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  padding: 16px;
  align-items: start;
  flex-direction: column;
  justify-content: start;
`;

const StyledImage = styled.img`
  height: 260px;
  border-radius: 8px;
  width: fit-content;
  object-fit: contain;
`;

const StyledSynopsis = styled.span`
  gap: 20px;
  display: flex;
  margin-top: 15px;
  flex-direction: column;
`;

const StyledImageAndDataRow = styled.div`
  width: 100%;
  height: 260px;
  display: flex;
  align-items: start;
  margin-bottom: 2rem;
  justify-content: start;
`;

const StyledData = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledButtons = styled.div`
  gap: 10px;
  width: 100%;
  display: flex;
  height: fit-content;
`;

const StyledTagsContainer = styled.div`
  gap: 8px;
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0px;
`;

const StyledGenres = styled.div`
  height: 30px;
  padding: 8px;
  display: flex;
  font-size: 14px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background-color: var(--color-grey-200);
`;

const Title = () => {
  const dispatch = useDispatch();
  const { titleId, type } = useParams();
  const { isLoading, error, title } = useTitleDetails(type, titleId);
  const isModalOpen = useSelector((state) => state.modal);
  const titleDetails = useSelector((state) => state.title);

  useEffect(() => {
    if (title) {
      dispatch(addToHistory(title));
    }
  }, [dispatch, title]);

  const { isLoading: isGettingLibraryTitles, titles: libraryTitles } =
    useGetLibrary();

  useEffect(() => {
    if (!isGettingLibraryTitles && libraryTitles) {
      dispatch(setTitles(libraryTitles));
    }
  }, [dispatch, isGettingLibraryTitles, libraryTitles, isLoading]);

  const library = useSelector((state) => state.library);
  const isInLibrary = title
    ? library.some((libraryTitle) => libraryTitle.id === title.id)
    : false;

  // to sync the current title state if the title is added to library from the modal
  useEffect(() => {
    dispatch(currentTitle({ ...title, isInLibrary }));
  }, [dispatch, library, title, isInLibrary]);

  if (isLoading || isGettingLibraryTitles) return <Spinner />;
  if (error) return <p>An error occurred. Please try again later.</p>;

  const {
    url,
    webpImage,
    title: titleName,
    titleJapanese,
    status,
    score,
    favorites,
    synopsis,
    genres,
    themes,

    // Conditionally include additionalFields based on type
    ...additionalFields
  } = title;

  const { episodes, rating, chapters, volumes } =
    type === "anime" ? additionalFields : additionalFields;

  document.title = `Manga Pulse | ${capitalizeFirstLetter(
    type
  )} - ${titleName}`;

  return (
    <StyledSection>
      <StyledImageAndDataRow>
        <StyledImage src={webpImage} alt="img" />
        <StyledData>
          {/* div to enforce space bwtween text and buttons */}
          <div>
            <Heading as="h2">
              {titleName}
              <FaExternalLinkAlt
                style={{
                  marginLeft: "6px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => handleClickTitle(url)}
              />
            </Heading>
            <Heading as="h5">{titleJapanese}</Heading>
            {/* Stats */}
            <span>
              <Heading as="h5">
                <FaStar style={{ color: "gold" }} /> {score} <FaBookmark />{" "}
                {formatFavorites(favorites)}
              </Heading>
            </span>
            <Heading as="h5">
              {episodes &&
                `${episodes} ${
                  episodes > 1 ? "episodes" : "episode"
                } ● ${status}, ${rating}`}
              {chapters &&
                `${chapters} ${
                  chapters > 1 ? "chapters" : "chapter"
                } | Status: ${status}`}
            </Heading>
          </div>
          {/* bookmark & share */}
          <StyledButtons>
            <TitleButton as="edit" onClick={() => dispatch(openModal())}>
              {titleDetails.isInLibrary ? (
                <MdBookmarkAdded />
              ) : (
                <IoBookmarksOutline />
              )}
            </TitleButton>

            <TitleButton as="share" onClick={handleShareButtonClick}>
              <IoShareOutline />
            </TitleButton>
          </StyledButtons>
        </StyledData>
      </StyledImageAndDataRow>

      <Heading>Genres</Heading>
      <StyledTagsContainer>
        {genres.map((genre, index) => (
          <StyledGenres key={index}>{genre.name}</StyledGenres>
        ))}
      </StyledTagsContainer>

      <Heading>Themes</Heading>
      <StyledTagsContainer>
        {themes.map((theme, index) => (
          <StyledGenres key={index}>{theme.name}</StyledGenres>
        ))}
      </StyledTagsContainer>

      <StyledSynopsis>
        <Heading>Synopsis</Heading>
        {synopsis}
      </StyledSynopsis>

      {type !== "manga" && <RecommendationsById id={titleId} />}

      {type === "manga" && <MangaRecommendationsById id={titleId} />}

      {/* Conditionally render the modal based on the state */}
      {isModalOpen && <Modal />}
    </StyledSection>
  );
};

export default Title;
