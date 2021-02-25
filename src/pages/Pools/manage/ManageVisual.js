import React from "react";
import aws_exports from "../../../aws-exports";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { Button } from "../../../components/Button";
import { v4 as uuidv4 } from "uuid";

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

export default class ChangeAppearance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: props.result,
      image: "",
      id: props.result.id,
      title: props.result.title,
      description: props.result.description,
      tnc: props.result.tnc,
      Status: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    Storage.get(this.state.result.image.key).then((val) =>
      this.setState({ image: val })
    );
  }

  addImageToDB(image) {
    const { id } = this.state.result;
    console.log(id);
    API.graphql(
      graphqlOperation(updatePool, {
        input: { id: id, image: image },
      })
    )
      .then(() => console.log("file uploaded"))
      .catch((err) => console.log(err));
  }

  onImageUpload(e) {
    const file = e.target.files[0];

    const key =
      uuidv4() + "." + file.name.split(".")[file.name.split(".").length - 1];

    Storage.configure({ level: "public" });
    Storage.put(key, file, { contentType: "image/png" }).then(() => {
      this.setState({ image: URL.createObjectURL(file) });
      const image = {
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_user_files_s3_bucket_region,
        key: key,
      };

      this.addImageToDB(image);
    });
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }
  onDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }
  onTNCChange(event) {
    this.setState({ tnc: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ Status: "loading" });
    const { id, title, description, tnc } = this.state;

    console.log(id);

    API.graphql(
      graphqlOperation(updatePool, {
        input: {
          id: id,
          title: title,
          description: description,
          tnc: tnc,
        },
      })
    )
      .then((val) => {
        this.setState({ Status: "success" });
        console.log(val);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ Status: err.message });
      });
  }

  render() {
    let confirmation;
    if (this.state.Status === "") {
      confirmation = <p></p>;
    } else if (this.state.Status === "loading") {
      confirmation = <p style={{ color: "#009432" }}>Updating Pool..</p>;
    } else if (this.state.Status === "success") {
      confirmation = <p style={{ color: "#009432" }}>Pool Updated</p>;
    } else {
      confirmation = <p style={{ color: "#ED4C67" }}>{this.state.Status}</p>;
    }
    return (
      <div className="pool-page-content">
        <div className="auth-form-container">
          <div className="pool-upload-image">
            <img
              className="pool-page-image"
              src={this.state.image}
              alt="pool background"
            />
            <h1 className="pool-image-title">{this.state.title}</h1>
            <div className="pool-image-submit-button">
              <h2>Change image</h2>
              <input
                type="file"
                onChange={(event) => this.onImageUpload(event)}
                multiple
                accept="image/*"
              />
            </div>
          </div>
          <form onSubmit={this.onSubmit}>
            <h3 className="form-label">Change experiment appearance</h3>
            <h3 className="form-text">
              experiment name
              <span className="form-span">
                This will appear as the title of the experiment
              </span>
            </h3>
            <input
              className="contact-email-input"
              id="title"
              type="text"
              required
              defaultValue={this.state.title}
              onChange={this.onTitleChange.bind(this)}
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
              defaultValue={this.state.description}
              onChange={this.onDescriptionChange.bind(this)}
            />
            <div className="form-bottom-content">
              {confirmation}
              <Button buttonSize="btn--form" Color="#f1f3f6" type="submit">
                Save!
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
