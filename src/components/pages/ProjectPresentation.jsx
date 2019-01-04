import React, { Component } from 'react';
import MDParser from 'markdown-it';
import MyLink from '../MyLink';
import Button from '../Button';
import Icon from '../Icon';

import octocat from '../../assets/octocat.png';

const md = new MDParser();

export default class ProjectPresentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataLoaded: false,
      description: {},
    }

    fetch(props.jsonDataPath)
      .then(d => d.json())
      .then(d => {
        this.setState({ data: d, dataLoaded: true });

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
          <Button href={githubUrl}>
            <img src={octocat} className='octocat' />
            gitHub
          </Button>
          // <MyLink href={githubUrl}></MyLink>
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