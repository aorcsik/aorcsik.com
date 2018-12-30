/* global $ */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  root: {
    //...theme.mixins.gutters(),
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

    this.loadOEmbedLink = this.loadOEmbedLink.bind(this);
  }

  componentDidMount() {
    this.setState({mounted: true});
    this.loadOEmbedLink(this.props.links, 0);
  }

  // https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse/
  // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-loading-and-initialization
  componentDidUpdate() {
    if (this.props.show) {
      if (this.state.data.facebook && window.FB.XFBML) window.FB.XFBML.parse(document.getElementById("facebook-" + this.state.data.facebook.id));
      if (this.state.data.twitter && window.twttr.widgets) window.twttr.widgets.load(document.getElementById("twitter-" + this.state.data.twitter.id));
      if (this.state.data.instagram && window.instgrm) window.instgrm.Embeds.process(document.getElementById("instagram-" + this.state.data.instagram.id));
      window.setTimeout(function() {
        this.props.onSocialRender();
      }.bind(this), 200);
    }
  }

  // FUNCTIONS

  loadOEmbedLink(links, idx) {
    if (!links[idx]) return;

    let link = links[idx];
    let source = null;
    if (link.match(/facebook\.com/)) {
      // https://developers.facebook.com/docs/plugins/oembed-endpoints/
      source = {
        url: "https://www.facebook.com/plugins/post/oembed.json/?maxwidth=350&omitscript=1&url=" + encodeURIComponent(link),
        type: "facebook",
        dataType: "jsonp"
      };
    } else if (link.match(/twitter\.com/)) {
      // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-oembed
      source = {
        url: "https://publish.twitter.com/oembed?maxwidth=350&omit_script=1&url=" + encodeURIComponent(link),
        type: "twitter",
        dataType: "jsonp"
      };
    } else if (link.match(/instagram\.com/)) {
      // https://www.instagram.com/developer/embedding/
      source = {
        url: "https://api.instagram.com/oembed?maxwidth=350&omitscript=1&url=" + encodeURIComponent(link),
        type: "instagram",
        dataType: "json"
      };
    }

    if (source) {
      $.ajax({
        url: source.url,
        dataType: source.dataType,
        success: (data) => {
          data.id = data.media_id || data.url.replace(/http.*\//, "");
          this.setState({
            loaded: true,
            data: $.extend(this.state.data, {
              [source.type]: data
            })
          });
        }
      });
    } else {
      this.loadOEmbedLink(links, idx + 1);
    }
  }

  // RENDER

  render() {
    const { classes } = this.props;
    const { mounted, loaded, data } = this.state;

    if (!mounted || !loaded)  {
      return (
        <div className={classes.root}>
        </div>
      );
    } else {
      if (data.instagram) {
        return (
          <Paper className={classNames(classes.root, "instagram-post")} id={"instagram-" + data.instagram.id} style={{display: this.props.show ? "block" : "none", width: this.props.width, padding: 0}}>
            <div dangerouslySetInnerHTML={{__html: data.instagram.html.replace(/max-width:350px/, "max-width:" + this.props.width + "px")}} />
          </Paper>
        );
      } else if (data.facebook) {
        return (
          <Paper className={classNames(classes.root, "facebook-post")} id={"facebook-" + data.facebook.id} style={{display: this.props.show ? "block" : "none", width: this.props.width, padding: 0}}>
            <div dangerouslySetInnerHTML={{__html: data.facebook.html.replace(/data-width="350"/, "data-width=\"" + this.props.width + "\"")}} />
          </Paper>
        );
      } else if (data.twitter){
        return (
          <Paper className={classNames(classes.root, "twitter-post")} id={"twitter-" + data.twitter.id} style={{display: this.props.show ? "block" : "none", width: this.props.width, padding: 0}}>
            <div dangerouslySetInnerHTML={{__html: data.twitter.html.replace(/data-width="350"/, "data-width=\"" + this.props.width + "\"")}} />
          </Paper>
        );
      }
    }
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired
};

export default withStyles(styles, { withTheme: true })(Post);
