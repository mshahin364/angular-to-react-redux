import React from 'react'
import Formsy from 'formsy-react';
import MaskedInput from 'react-text-mask'

export const FormsyInput = React.createClass({
  mixins: [Formsy.Mixin],

  changeValue(event) {
    this.props.onChange(event)
    this.setValue(event.currentTarget.value);
  },

  render() {
    const className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

    const errorMessage = this.getErrorMessage();

    return (
      <div className={className}>
        <input type="text"
               onChange={this.changeValue}
               value={this.getValue()}
               name={this.props.name} />

        <span>{errorMessage}</span>
      </div>
    );
  }
});