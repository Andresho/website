import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { DropDown } from "../../components/DropDown";
import { Link, withRouter } from "react-router-dom";
import { API, graphqlOperation, Auth } from "aws-amplify";
import aws_exports from "../../aws-exports";

export const createPool = /* GraphQL */ `
  mutation CreatePool(
    $input: CreatePoolInput!
    $condition: ModelPoolConditionInput
  ) {
    createPool(input: $input, condition: $condition) {
      id
    }
  }
`;

const listCatagorys = /* GraphQL */ `
  query ListCatagorys(
    $filter: ModelCatagoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCatagorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
      }
      nextToken
    }
  }
`;

const defaultBackgrounds = [
  "Aare.png",
  "Clarence.png",
  "Doubs.png",
  "Hinterrhein..png",
  "Inn.png",
  "Kander.png",
  "Linth.png",
  "Mataura.png",
  "Mohaka.png",
  "Ngaruroro.png",
  "Oreti.png",
  "Rangitikei.png",
  "Reuss.png",
  "Rhône.png",
  "Taieri.png",
  "Thur.png",
  "Vorderrhein.png",
  "Waiau.png",
  "Waihou.png",
  "Waimakariri.png",
  "Wairau.png",
  "Whangaehu.png",
];

const CreateForm = ({ history }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dropDown, setDropdown] = useState(-1);
  const [categoryIds, setCategoryIds] = useState([]);
  const [categoryTitles, setCategoryTitles] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    const filter = {
      status: { eq: "PUBLISHED" },
    };

    API.graphql(
      graphqlOperation(listCatagorys, {
        filter,
      })
    )

      .then((val) => {
        setCategoryIds(
          val.data.listCatagorys.items.map((catagory) => catagory.id)
        );
        setCategoryTitles(
          val.data.listCatagorys.items.map((catagory) => catagory.title)
        );
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    const bg =
      defaultBackgrounds[Math.floor(Math.random() * defaultBackgrounds.length)];

    const image = {
      bucket: aws_exports.aws_user_files_s3_bucket,
      region: aws_exports.aws_user_files_s3_bucket_region,
      key: bg,
    };

    if (dropDown !== -1) {
      Auth.currentAuthenticatedUser()
        .then((val) => {
          API.graphql(
            graphqlOperation(createPool, {
              input: {
                title: name,
                description,
                requiredtrust: 0.5,
                image,
                tnc: "",
                status: "UNPUBLISHED",
                catagoryID: categoryIds[dropDown],
                //xtypeID: "",
                //ytypeID: "",
                owner: val.username,
              },
            })
          )
            .then(() => {
              setStatus("success");
              history.push("/manage-pools");
            })
            .catch((err) => {
              console.log(err);
              setStatus(err.message);
            });
        })
        .catch((err) => console.log(err));
    } else {
      setStatus("Please select a category");
    }
  };

  let confirmation;
  if (status === "") {
    confirmation = <p></p>;
  } else if (status === "loading") {
    confirmation = <p style={{ color: "#009432" }}>Creating Experiment..</p>;
  } else if (status === "success") {
    confirmation = <p style={{ color: "#009432" }}>Experiment Created</p>;
  } else {
    confirmation = <p style={{ color: "#ED4C67" }}>{status}</p>;
  }

  return (
    <div className="auth-form-container">
      <form onSubmit={onSubmit}>
        <p style={{ color: "#6c63ff" }}>
          You will have plenty more opportunities to update and edit your
          experiment before publishing it to the public. This is just an initial
          setup, all of the values entered here can be changed.
        </p>
        <h3 className="form-label">Create experiment</h3>
        <h3 className="form-text">
          Experiment name
          <span className="form-span">
            This will appear as the title of the experiment
          </span>
        </h3>
        <input
          className="contact-email-input"
          id="title"
          type="text"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <h3 className="form-text">
          Enter Description
          <span className="form-span">
            users will be able to read the discription
          </span>
        </h3>
        <textarea
          className="contact-email-input tall-input"
          rows="6"
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <h3 className="form-text">
          Sample format
          <span className="form-span">
            Also note right now not many data formats are supported, if you are
            intrested in one that doesn't exist yet
            <Link to="/contact" target="_blank" className="form-link-small">
              Contact us and we will make it happen.
            </Link>
          </span>
        </h3>
        <DropDown
          title="Select Category"
          list={categoryTitles}
          output={(e) => setDropdown(e)}
        />
        <div className="form-bottom-content">
          {confirmation}
          <Button buttonColor="blue" type="submit" buttonSize="btn--form">
            Save!
          </Button>
        </div>
      </form>
    </div>
  );
};

export default withRouter(CreateForm);
