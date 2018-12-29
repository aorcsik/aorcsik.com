/* global $ */

import React from "react";
import PropTypes from "prop-types";
// import classNames from "classnames";
import { Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginBottom: theme.spacing.unit * 2
  },
});

class Post extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      mounted: false,
      loaded: false,
      data: {},
    };
  }

  componentDidMount() {
    this.setState({mounted: true});

    this.props.links.forEach((link) => {

      // https://developers.facebook.com/docs/plugins/oembed-endpoints/
      if (link.match(/facebook\.com/)) {
        $.ajax({
          url: "https://www.facebook.com/plugins/post/oembed.json/?maxwidth=350&omitscript=1&url=" + encodeURIComponent(link),
          dataType: "jsonp",
          success: (data) => {
            data.id = data.url.replace(/http.*\//, "");
            console.log(data);
            this.setState({
              loaded: true,
              data: $.extend(this.state.data, {
                facebook: data
              })
            });
          }
        });
      }

      // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-oembed
      if (link.match(/twitter\.com/)) {
        $.ajax({
          url: "https://publish.twitter.com/oembed?maxwidth=350&omit_script=1&url=" + encodeURIComponent(link),
          dataType: "jsonp",
          success: (data) => {
            data.id = data.url.replace(/http.*\//, "");
            console.log(data);
            this.setState({
              loaded: true,
              data: $.extend(this.state.data, {
                twitter: data
              })
            });
          }
        });
      }
    });
  }

  // https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse/
  // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-loading-and-initialization
  componentDidUpdate() {
    if (this.state.data.facebook) window.FB.XFBML.parse(document.getElementById("facebook-" + this.state.data.facebook.id));
    if (this.state.data.twitter) window.twttr.widgets.load(document.getElementById("twitter-" + this.state.data.twitter.id));
  }

  // FUNCTIONS

  // RENDER

  render() {
    const { classes } = this.props;
    const { mounted, loaded, data } = this.state;

    if (!mounted || !loaded)  {
      return (
        <div className={classes.root}>
          Loading...
        </div>
      );
    } else {
      if (data.facebook) {
        return (
          <div id={"facebook-" + data.facebook.id} className={classes.root} dangerouslySetInnerHTML={{__html: data.facebook.html}} />
        );
      } else if (data.twitter){
        return (
          <div id={"twitter-" + data.twitter.id} className={classes.root} dangerouslySetInnerHTML={{__html: data.twitter.html}} />
        );
      }
    }
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(Post);
