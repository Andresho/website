import React from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { DropDown } from "../../../components/DropDown";
import { Button } from "../../../components/Button";
import { Link } from "react-router-dom";
import { FaCopy, FaEye, FaEyeSlash } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { v4 as uuidv4 } from "uuid";
//import aws_exports from "../../aws-exports";

import Dropzone from "react-dropzone";

const updatePool = /* GraphQL */ `
  mutation UpdatePool(
    $input: UpdatePoolInput!
    $condition: ModelPoolConditionInput
  ) {
    updatePool(input: $input, condition: $condition) {
      id
    }
  }
`;

export const getPool = /* GraphQL */ `
  query GetPool($id: ID!) {
    getPool(id: $id) {
      privateKey
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

export default class ChangeAppearance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.result.id,
      result: props.result,
      privateKey: props.result.privateKey || "",
      keyVisibility: false,
      catagoryIds: [],
      catagoryTitles: [],
      dd: 0,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onDropDownChange = this.onDropDownChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    files.forEach((file) => {
      const key =
        uuidv4() + "." + file.name.split(".")[file.name.split(".").length - 1];

      //can you configure storage in-line? directly in put
      Storage.configure({ level: "protected", bucket: "pooldata211140-dev" });

      Storage.put(key, file, { contentType: "image/png" }).then(() => {
        this.setState({ image: URL.createObjectURL(file) });
        //const image = {
        //  bucket: aws_exports.aws_user_files_s3_bucket,
        //  region: aws_exports.aws_user_files_s3_bucket_region,
        //  key: key,
        //};

        //this.addImageToDB(image);
      });
    });
  }

  getCatagories() {
    const filter = {
      status: { eq: "PUBLISHED" },
    };

    API.graphql(
      graphqlOperation(listCatagorys, {
        filter: filter,
      })
    )

      .then((val) => {
        this.setState({
          catagoryIds: val.data.listCatagorys.items.map(
            (catagory) => catagory.id
          ),
          catagoryTitles: val.data.listCatagorys.items.map(
            (catagory) => catagory.title
          ),
        });
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getCatagories();
  }

  onDropDownChange(event) {
    this.setState({ dd: event });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ Status: "loading" });
    const { id } = this.state;

    console.log(id);

    API.graphql(
      graphqlOperation(updatePool, {
        input: {
          id: id,
          privateKey: "new key please",
        },
      })
    )
      .then((val) => {
        API.graphql(graphqlOperation(getPool, { id: id }))
          .then((val) => {
            this.setState({
              Status: "success",
              privateKey: val.data.getPool.privateKey,
            });
            console.log(val);
          })
          .catch((err) => {
            console.log(err);
            this.setState({ Status: err.message });
          });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ Status: err.message });
      });
  }

  toggleVisiblity() {
    this.setState({ keyVisibility: !this.state.keyVisibility });
  }

  render() {
    let VisibleKey;
    if (this.state.keyVisibility) {
      VisibleKey = this.state.privateKey;
    } else {
      VisibleKey = "*".repeat(this.state.privateKey.length);
    }

    let confirmation;
    if (this.state.Status === "") {
      confirmation = <p></p>;
    } else if (this.state.Status === "loading") {
      confirmation = <p style={{ color: "#009432" }}>Generating key...</p>;
    } else if (this.state.Status === "success") {
      confirmation = <p style={{ color: "#009432" }}>Key generated</p>;
    } else if (this.state.Status === "copied") {
      confirmation = <p style={{ color: "#009432" }}>Copied to clipboard!</p>;
    } else {
      confirmation = <p style={{ color: "#ED4C67" }}>{this.state.Status}</p>;
    }
    return (
      <div className="pool-page-content">
        <div className="auth-form-container">
          <form onSubmit={this.onSubmit}>
            <h3 className="form-label">Manage access to your pool</h3>
            <h3 className="form-text">
              Private key
              <span className="form-span">
                Use this key to manage the pool from the backend
              </span>
            </h3>
            <h2 className="contact-email-input">
              {VisibleKey}
              {!this.state.keyVisibility && (
                <FaEye
                  className="key-icon"
                  onClick={() => this.toggleVisiblity()}
                />
              )}
              {this.state.keyVisibility && (
                <FaEyeSlash
                  className="key-icon"
                  onClick={() => this.toggleVisiblity()}
                />
              )}
              <CopyToClipboard
                text={this.state.privateKey}
                onCopy={() => this.setState({ Status: "copied" })}
              >
                <FaCopy className="key-icon" />
              </CopyToClipboard>
            </h2>

            <div className="form-bottom-content">
              {confirmation}
              <Button buttonSize="btn--form" Color="#f1f3f6" type="submit">
                Reset key
              </Button>
            </div>
          </form>
          <form onSubmit={this.onSubmit}>
            <h3 className="form-text">
              Sample cross-verification level
              <span className="form-span">
                This is a temporary estimation, and will be adjusted when
                gathering begins.
              </span>
            </h3>
            <div className="form-bottom-content">
              <input type="range" min="0" max="1" step="0.001" />
              <h3 className="form-text">
                Initial estimated cost per sample{" "}
                <span style={{ color: "#6c63ff" }}>£0.0102</span>
              </h3>
            </div>

            <h3 className="form-text">
              Sample format
              <span className="form-span">
                Also note right now not many data formats are supported, if you
                are intrested in one that doesn't exist yet
                <Link to="/contact" target="_blank" className="form-link-small">
                  Contact us and we will make it happen.
                </Link>
              </span>
            </h3>
            <DropDown
              title="Select Catagory"
              list={this.state.catagoryTitles}
              output={this.onDropDownChange}
              initial={0}
            />
            <Dropzone onDrop={(acceptedFiles) => this.onDrop(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </form>
        </div>
      </div>
    );
  }
}
