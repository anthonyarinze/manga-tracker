import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import StyledCardLink from "./StyledCardLink";

const StyledSearchResultItem = styled.div`
  padding: 8px;
  display: flex;
  cursor: pointer;
  overflow: hidden;
  font-size: 1.4rem;
  margin-bottom: 5px;
  border-radius: 8px;
  align-items: center;
  justify-content: start;
  text-overflow: ellipsis;
  transition: all 0.1s ease;
  background-color: #2c2c2c;
  border: 1px solid var(--color-grey-300);

  &:hover {
    transform: scale(1.03);
    border: 2px solid var(--color-grey-300);
    background-color: var(--color-grey-100);
  }
`;

const StyledImg = styled.img`
  width: 60px;
  height: 70px;
  border: none;
  margin-left: 5px;
  border-radius: 8px;
`;

const StyledBody = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  margin-left: 8px;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledTitle = styled.h5`
  color: white;
  overflow: hidden;
  margin-bottom: 0;
  text-overflow: ellipsis;
`;

const StyledDetails = styled.div`
  display: flex;
  font-size: smaller;
  align-items: center;
`;

const StyledStatus = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  font-size: smaller;
  align-items: center;
  justify-content: space-between;
`;

const StyledMediaType = styled.div`
  height: 100%;
  padding: 8px;
  display: flex;
  margin-top: 6px;
  border-radius: 4px;
  align-items: center;
  background-color: ${(props) =>
    props.mediatype === "Manga"
      ? "var(--color-grey-200)"
      : "var(--color-brand-800)"};
`;

const SearchResultItem = ({
  webp,
  name,
  rating,
  status,
  episodes,
  id,
  mediaType,
  onClick,
}) => {
  const type = mediaType.toLowerCase() === "manga" ? "manga" : "anime";

  return (
    <StyledCardLink to={`/title/${type}/${id}`}>
      <StyledSearchResultItem onClick={onClick}>
        <StyledImg src={webp} alt="img" />
        <StyledBody>
          <StyledTitle>{name}</StyledTitle>
          <StyledDetails>
            <FaStar style={{ marginRight: "3px", color: "gold" }} /> {rating} •{" "}
            {type === "manga" ? (
              <>
                {episodes}
                {episodes > 1 ? " chapters" : " chapter"}
              </>
            ) : (
              <>
                {episodes}
                {episodes > 1 ? " episodes" : " episode"}
              </>
            )}
          </StyledDetails>
          <StyledStatus>
            <StyledMediaType mediatype={mediaType}>{mediaType}</StyledMediaType>
            {status}
          </StyledStatus>
        </StyledBody>
      </StyledSearchResultItem>
    </StyledCardLink>
  );
};

export default SearchResultItem;
