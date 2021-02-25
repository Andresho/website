import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Storage } from "aws-amplify";

const ImageCardItem = ({ imageData, label, text, path }) => {
  const [image, setImage] = useState([]);
  const { key, bucket, region } = imageData;

  useEffect(() => {
    Storage.get(key, {
      config: { bucket: bucket, region: region },
    }).then((val) => setImage(val));
  }, [key, bucket, region]);

  return (
    <>
      <li className="text__cards__item">
        <Link className="cards__item__link" to={path}>
          <figure className="cards__item__pic-wrap" data-category={label}>
            <img className="cards__item__img" src={image} alt="information" />
          </figure>
          <div className="cards__item__info">
            <h5 className="cards__item__text">{text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
};

export default ImageCardItem;
