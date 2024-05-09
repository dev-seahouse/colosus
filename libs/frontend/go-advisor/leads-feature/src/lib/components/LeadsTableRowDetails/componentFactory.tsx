import type {
  IGenericDataSummaryDto,
  IGenericDataSummaryFieldDto,
} from '@bambu/shared';

import { SharedEnums } from '@bambu/shared';
import type { ReactNode } from 'react';
import React from 'react';
import CurrencyText from './CurrencyText';
interface ComponentFactoryProps {
  /* A Section contains a *section title* AND *children nodes* of ItemComponents. */
  sectionComponent: React.ComponentType<SectionComponentProps>;
  /*
    An Item contains a *item title* AND *value children node(s)* of arbitrary type.
    children node(s) is rendered and customized by *valueFormatter* which defines how to render
    value children node(s) based on type and key and turns a callable function that takes in value
    and returns ReactNode
  */
  itemComponent: React.ComponentType<ItemComponentProps>;
  /*
    By default all sections are rendered like so <Section><Item/><Item/></Section>,
    customSections is an object map that defines sections that should not be rendered with the default
    <Section>....</Section> structure,based on keys.
    e.g (key === "PERSONAL_DETAILS") ? customSections[key]({title, fields}): <Section>....</Section>
  */
  customSections?: CustomSections;
  getFormatter?: GetFormatterFn;
  data: Array<IGenericDataSummaryDto> | undefined;
}

export interface SectionComponentProps {
  title: string;
  children: ReactNode;
}
export type ItemComponentProps = SectionComponentProps;

export type CustomSections = Record<string, CustomRenderFn>;

export type CustomRenderFn = ({
  fields,
  displayName,
}: {
  fields: IGenericDataSummaryFieldDto[];
  displayName: string;
}) => ReactNode;

export type CustomRenderFnProps = Parameters<CustomRenderFn>[0];

export type GetFormatterFn = ({
  type,
  key,
}: {
  type: SharedEnums.EnumGenericDataSummaryFieldType;
  key: string;
}) => (value: string) => ReactNode;

export type FormatterProps = Parameters<GetFormatterFn>[0];

export function componentFactory({
  sectionComponent: Section,
  itemComponent: Item,
  customSections,
  getFormatter = defaultGetFormatter,
  data,
}: ComponentFactoryProps) {
  return function make() {
    if (!data) return null;
    return React.Children.toArray(
      data.map(
        (
          { displayName: sectionDisplay, fields, key: sectionKey },
          sectionIdx
        ) => {
          const customRender = customSections?.[sectionKey];
          if (!customRender) {
            return (
              <Section title={sectionDisplay}>
                {fields.map(
                  ({ displayName: itemDisplay, value, type, key }, itemIdx) => {
                    const formatter = getFormatter({ type, key });
                    return (
                      <Item
                        title={itemDisplay}
                        key={`${itemIdx}_${itemDisplay}_${value}`}
                      >
                        {formatter(value)}
                      </Item>
                    );
                  }
                )}
              </Section>
            );
          }

          return customRender({ fields, displayName: sectionDisplay });
        }
      )
    );
  };
}

export function defaultGetFormatter({ type, key }: FormatterProps) {
  const formatters = {
    [SharedEnums.EnumGenericDataSummaryFieldType.STRING]: (value: string) =>
      value ?? '-',
    [SharedEnums.EnumGenericDataSummaryFieldType.NUMBER]: (value: string) =>
      Number(value) ?? 0,
    [SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY]: (value: string) =>
      value == null ? '-' : <CurrencyText value={Number(value)} />,
  };
  return formatters[type];
}
