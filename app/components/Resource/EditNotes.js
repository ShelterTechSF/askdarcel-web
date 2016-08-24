import React, { Component } from 'react';
import Loader from '../Loader';

class EditNotes extends Component {
	constructor(props) {
		super(props);

		this.state = ({notes: this.props.notes});
	}

	handleNoteChange(index, note) {
		let notes = this.state.notes;
		notes[index] = note;

		this.setState({notes: notes});
		this.handleNotesChange(notes);
	}

	renderNotes() {
		let notes = [];
		for(let i = 0; i < this.props.notes.length; i++) {
			notes.push(
				<EditNote key={i} index={i} note={this.props.notes[i]} handleChange={this.handleNoteChange} />
			);
		}

		return notes;
	}

	render() {
		<div>
			{this.renderNotes()}
		</div>
	}
}

class EditNote extends Component {
	constructor(props) {
		super(props);

		this.state = ({note: this.props.note});
	}

	handleNoteChange(e) {
		this.setState({note: e.target.value});
		this.props.handleChange(this.props.index, this.state.note);
	}

	render() {
		return (
			<div>
				<div>Note</div>
				<textarea defaultValue={this.props.note} onBlur={this.handleFieldChange} />
			</div>
		);
	}
}