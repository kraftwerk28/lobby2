import React, { Component } from 'react';
import MDParser from 'markdown-it';
import MyLink from '../MyLink';

const md = new MDParser();

export default class ProjectPresentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      description: {},
    }

    fetch(props.jsonDataPath)
      .then(d => d.json())
      .then(d => {
        this.setState({ data: d });

        if (d.readme) {
          fetch(d.readme)
            .then(d => d.text())
            .then(mdData => {
              this.setState({ description: md.render(mdData) });
            });
        }
      });
  }

  render() {
    const { githubUrl, npmUrl, siteUrl } = this.state.data;

    return (
      <div>
        {githubUrl &&
          <MyLink href={githubUrl}>gitHub</MyLink>
        }
        {npmUrl &&
          <MyLink href={npmUrl}>npm</MyLink>
        }
        {siteUrl &&
          <MyLink href={siteUrl}>site</MyLink>
        }
        {this.state.description ?
          <div dangerouslySetInnerHTML={{ __html: this.state.description }} /> :
          <h3>{'no description provided('}</h3>
        }
      </div>
    );
  }

}