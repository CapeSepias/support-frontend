// @flow

// $FlowIgnore
import * as React from 'preact/compat';
import { LinkButton } from '@guardian/src-button';
import type { TestimonialsCollection, Testimonial } from 'pages/aus-moment-map/types/testimonials';
import { Button } from '@guardian/src-button';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { contributeUrl } from '../utils';
import { buttonDefault } from '@guardian/src-foundations/themes';
import { ThemeProvider } from 'emotion-theming';

const TestimonialCtaPrimary = () => (
  <div className="testimonial-cta testimonial-cta-primary">
    <h3>Are you a supporter?</h3>
    <p>
    If you’re a contributor or subscriber, we would love to hear from you
    </p>

    <ThemeProvider theme={buttonDefault}>
      <LinkButton
        className="testimonial-cta-primary-link-button"
        priority="primary"
        size="small"
        href="https://guardiannewsampampmedia.formstack.com/forms/australia_2021"
        target="_blank"
        rel="noopener noreferrer"
      >
        Add your message
      </LinkButton>
    </ThemeProvider>
  </div>
);

const TestimonialCtaSecondary = () => (
  <div className="testimonial-cta testimonial-cta-secondary">
    <h3>Do something powerful today</h3>

    <LinkButton
      className="testimonial-cta-secondary-link-button"
      priority="primary"
      size="small"
      href={contributeUrl('Aus_Moment_2021_map_inline')}
      target="_blank"
      rel="noopener noreferrer"
    >Support the Guardian
    </LinkButton>
  </div>
);

type TestimonialComponentProps = {
  testimonial: Testimonial
}

const TestimonialComponent = (props: TestimonialComponentProps) => {
  const city = props.testimonial.city ? `, ${props.testimonial.city}` : '';
  return (
    <div className="testimonial-component">
      <div>
      &#8220;{props.testimonial.body}&#8221;
      </div>
      <div className="testimonial-component-details">
        {props.testimonial.name}
        {city}
      </div>
    </div>
  );
};

const TERRITORY_CODE_TO_FULL_NAME = {
  QLD: 'Queensland',
  NSW: 'New South Wales',
  NT: 'Northern Territory',
  SA: 'South Australia',
  TAS: 'Tasmania',
  VIC: 'Victoria',
  WA: 'Western Australia',
  ACT: 'Australian Capital Territory',
};

type TestimonialsForTerritoryProps = {
  territory: string,
  shouldScrollIntoView: boolean,
  testimonials: Array<Testimonial>,
  selectedTerritory: string,
  setSelectedTerritory: string => void,
}

const LocationMarker = () => (
  <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 5.99998C12 6.82498 11.85 7.69997 11.5 8.64997L6.49998 21.9999H5.49998L0.549998 8.59997C0.249999 7.79997 0 6.87498 0 5.99998C0 2.69999 2.69999 0 5.99998 0C9.29997 0 12 2.69999 12 5.99998ZM1.74999 5.99998C1.74999 8.32497 3.67499 10.25 5.99998 10.25C8.32497 10.25 10.25 8.32497 10.25 5.99998C10.25 3.67499 8.32497 1.74999 5.99998 1.74999C3.67499 1.74999 1.74999 3.67499 1.74999 5.99998Z" fill="#052962" />
  </svg>
);

const TestimonialsForTerritory = (props: TestimonialsForTerritoryProps) => {
  const { windowWidthIsGreaterThan, windowWidthIsLessThan } = useWindowWidth();

  const midPointIndex = Math.ceil(props.testimonials.length / 2) - 1;

  const firstColumn = props.testimonials.slice(0, midPointIndex + 1)
    .map(testimonial => <TestimonialComponent testimonial={testimonial} />);

  const secondColumn = props.testimonials
    .slice(midPointIndex + 1)
    .map(testimonial => <TestimonialComponent testimonial={testimonial} />);

  const ctaIndex = secondColumn.length < 5 ? secondColumn.length : 3;

  secondColumn.splice(ctaIndex, 0, <TestimonialCtaPrimary />);
  secondColumn.push(<TestimonialCtaSecondary />);

  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      const onScroll = () => {
        const testimonialsHeader = ref.current.querySelector('.testimonials-for-territory-header');
        const testimonialsContainer = testimonialsHeader.parentNode.parentNode.parentNode;
        const testimonialsContainerHeader = testimonialsContainer.querySelector('.testimonials-container-header');

        if (windowWidthIsLessThan('desktop')) {
          if (ref.current.getBoundingClientRect().top <= testimonialsContainerHeader.clientHeight) {
            testimonialsHeader.classList.add('sticky');
            testimonialsHeader.style.top = `${testimonialsContainerHeader.clientHeight}px`;
          } else {
            testimonialsHeader.classList.remove('sticky');
            testimonialsHeader.style.top = 'initial';
          }
        }
      };

      document.addEventListener('scroll', onScroll);
      return () => document.removeEventListener('scroll', onScroll);
    }

    return () => {};
  }, [ref.current]);

  React.useEffect(() => {
    if (ref.current) {
      const {
        offsetTop,
        offsetHeight,
        parentNode: testimonialsContainer,
      } = ref.current;

      if (testimonialsContainer) {
        const onScroll = () => {
          if (testimonialsContainer.scrollTop >= offsetTop
          && testimonialsContainer.scrollTop < (offsetTop + offsetHeight)) {
            props.setSelectedTerritory(props.territory);
          }
        };

        testimonialsContainer.addEventListener('scroll', onScroll);
        return () => testimonialsContainer.removeEventListener('scroll', onScroll);
      }
    }
    return () => {};

  }, [ref.current]);

  React.useEffect(() => {
    if (windowWidthIsGreaterThan('desktop')) {
      if (ref.current && props.selectedTerritory === props.territory && props.shouldScrollIntoView) {
        const { offsetTop } = ref.current;
        const testimonialsContainer = ref.current.parentNode;
        testimonialsContainer.scroll(0, offsetTop);
      }
    }
  }, [ref.current, props.selectedTerritory]);

  const displayName = props.territory === 'ACT' && windowWidthIsLessThan('mobileMedium') ? props.territory :
    TERRITORY_CODE_TO_FULL_NAME[props.territory];

  return (
    <div className="testimonials-for-territory" ref={ref} id={props.territory}>
      <div className="testimonials-for-territory-header">
        <div className="testimonials-for-territory-header-text-and-icon-container">
          <LocationMarker />
          <h2 className="padded-multiline">
            <span>{displayName}</span>
          </h2>
        </div>
      </div>
      { windowWidthIsGreaterThan('tablet')
        ? <TestimonialsTwoColumns firstColumn={firstColumn} secondColumn={secondColumn} />
        : <TestimonialsExpandableSingleColumn testimonials={[...firstColumn, ...secondColumn]} /> }
    </div>
  );
};

type TestimonialsExpandableSingleColumnProps = {
  testimonials: Array<React.Node>
}

const UNEXPANDED_NUMBER_OF_TESTIMONIALS = 3;

const TestimonialsExpandableSingleColumn = (props: TestimonialsExpandableSingleColumnProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const testimonials = isExpanded ? props.testimonials : props.testimonials.slice(0, UNEXPANDED_NUMBER_OF_TESTIMONIALS);
  return (
    <>
      <div className="testimonials-columns-container">
        <div className="testimonials-first-column">
          {testimonials}
        </div>
      </div>
      <div className="testimonials-read-more-button-container">
        {!isExpanded &&
        <Button
          priority="tertiary"
          size="small"
          onClick={() => {
                setIsExpanded(true);
            }}
        >
          Read more
        </Button>}
      </div>
    </>
  );
};

type TestimonialTwoColumnsProps = {
  firstColumn: Array<React.Node>,
  secondColumn: Array<React.Node>,
}

const TestimonialsTwoColumns = (props: TestimonialTwoColumnsProps) => (
  <div className="testimonials-columns-container">
    <div className="testimonials-first-column">
      {props.firstColumn}
    </div>
    <div className="testimonials-second-column">
      {props.secondColumn}
    </div>
  </div>
);

const TestimonialsContainerHeader = () => {
  const self = React.useRef(null);
  React.useEffect(() => {
    if (self.current) {
      const parent = self.current.parentNode;

      const handleScroll = () => {
        if (parent.getBoundingClientRect().top <= 0) {
          self.current.classList.add('sticky');
        } else {
          self.current.classList.remove('sticky');
        }
      };

      document.addEventListener('scroll', handleScroll);
      return () => document.removeEventListener('scroll', handleScroll);
    }

    return () => {};
  }, [self.current]);

  return (
    <div className="testimonials-container-header" ref={self}>
      Why do you support <br />Guardian&nbsp;Australia?
    </div>
  );
};

type Props = {
  testimonialsCollection: TestimonialsCollection,
  selectedTerritory: string | null,
  shouldScrollIntoView: boolean,
  setSelectedTerritory: string => void,
};

export const TestimonialsContainer = React.forwardRef((props: Props, ref: React.Ref<typeof TestimonialsContainer>) => {
  const { windowWidthIsLessThan } = useWindowWidth();

  if (props.testimonialsCollection) {
    if (props.selectedTerritory || windowWidthIsLessThan('desktop')) {

      const testimonialsForTerritories = Object.keys(props.testimonialsCollection).map(territory => (
        <TestimonialsForTerritory
          testimonials={props.testimonialsCollection[territory]}
          territory={territory}
          shouldScrollIntoView={props.shouldScrollIntoView}
          selectedTerritory={props.selectedTerritory}
          setSelectedTerritory={props.setSelectedTerritory}
        />
      ));
      const midPointCtas = (
        <div className="midpoint-ctas">
          <TestimonialCtaPrimary />
          <TestimonialCtaSecondary />
        </div>
      );
      testimonialsForTerritories.splice(4, 0, midPointCtas);

      return (
        <>
          <TestimonialsContainerHeader />

          <div className="testimonials-container" ref={ref}>
            {testimonialsForTerritories}
          </div>
        </>
      );
    }
  }
  return null;
});
