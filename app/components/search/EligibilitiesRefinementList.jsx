import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectRefinementList } from 'react-instantsearch/connectors';

class EligibilitiesRefinementList extends Component {
	static propTypes = {
		items: PropTypes.array.isRequired,
		refine: PropTypes.func.isRequired,
		currentRefinement: PropTypes.array.isRequired
	};
	constructor(props) {
		super(props);
		this.changeRefinement = this.changeRefinement.bind(this);
		this.setChecks = this.setChecks.bind(this);
		this.eligibilitiesMapping = {
			"Disability": ["Disability", "Developmental Disability", "Physical Disability", "Learning Disability", "Intellectual Disability"],
			"Families": ["Families", "Families with Babies"],
			"Homeless": ["Homeless"],
			"Mental Health/Substance Use": ["Mental Illness", "Substance Dependency"],
			"Re-Entry/Incarcerated": ["Re-Entry"],
			"Seniors (55+ years old)": ["Seniors (55+ years old)"],
			"Transitional Aged Youth": ["Transitional Aged Youth"],
			"Trauma Survivors": ["Trauma Survivors"],
			"Veterans": ["Veterans"]
		};
		const checks = this.setChecks();
		this.state = {
			isChecked: checks
		}
	}

	setChecks() {
		const { currentRefinement } = this.props;
		const mapKeys = Object.keys(this.eligibilitiesMapping);
		const checks = [];
		for (var i=0; i<mapKeys.length; i++) {
			const key = mapKeys[i];
			let atLeastOneRefined = false;
			for (var i_1=0; i_1<this.eligibilitiesMapping[key].length; i_1++) {
				let val = this.eligibilitiesMapping[key][i_1];
				if (currentRefinement.includes(val)) {
					atLeastOneRefined = true;
					break;
				}
			}
			checks[key] = atLeastOneRefined;
		}
		return checks;
	}

	changeRefinement(key, event) {
		const { refine } = this.props;
		const { items } = this.props;
		for (var i=0; i<items.length; i++) {
			var item = items[i];
			if (this.eligibilitiesMapping[key].includes(item.label)) {
				refine(item.value);
			}
		}
	};

	componentDidUpdate(prevProps) {
		if (this.props.currentRefinement.sort().join(',') !== prevProps.currentRefinement.sort().join(',')) {
			const checks = this.setChecks();
			this.setState({isChecked:checks});
		}
	}

	render() {
		const { currentRefinement } = this.props;
		const { isChecked } = this.state;
		const mapKeys = Object.keys(this.eligibilitiesMapping);
		return (
			<div className="refinement-wrapper">
				<label className="refinement-title">Eligibilities</label>
				<ul className="refinement-ul">
					{mapKeys.map(key => (
						// for each map key, display it as a filtering option
						// for onClick of each option, call refine on the values of the key
						<li key={key} className={"refine-li " + (isChecked[key] ? 'active' : '')}>
							<label>
								<input
									type="checkbox"
									className="refine-checkbox"
									onChange={this.changeRefinement.bind(this, key)}
									checked={isChecked[key]}
								/>
								{key}
							</label>
						</li>
					))}
				</ul>
			</div>
		);
	}
};

export default connectRefinementList(EligibilitiesRefinementList);