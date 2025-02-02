import { QuestionSelectionType } from './question-step';
import SurveyCheckboxOption from './survey-checkbox-option';

const SurveyCheckboxControl = ( { onChange, question, value }: QuestionSelectionType ) => {
	return (
		<div className="question-options__container">
			{ question.options.map( ( option, index ) => (
				<SurveyCheckboxOption
					key={ index }
					option={ option }
					question={ question }
					onChange={ onChange }
					value={ value }
				/>
			) ) }
		</div>
	);
};

export default SurveyCheckboxControl;
