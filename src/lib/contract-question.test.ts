import { describe, expect, it } from 'vitest';

import { CONTRACT_QUESTION_NOT_FOUND, parseContractQuestionAnswer } from './contract-question';

const content = `CLÁUSULA SEXTA
6.1 A contratada deverá realizar manutenção preventiva mensalmente.
CLÁUSULA DÉCIMA
10.1 Os preços poderão ser reajustados após doze meses.`;

describe('parse da resposta sobre o contrato', () => {
  it('aceita resposta encontrada em JSON textual ou já decodificado', () => {
    const answer = {
      answer: 'Os preços poderão ser reajustados após doze meses.',
      found: true,
      sources: [{ clause: '10.1' }],
    };

    expect(parseContractQuestionAnswer(JSON.stringify(answer), content)).toEqual(answer);
    expect(parseContractQuestionAnswer(answer, content)).toEqual(answer);
  });

  it('aceita somente a mensagem canônica sem fontes quando a informação não existe', () => {
    const answer = { answer: CONTRACT_QUESTION_NOT_FOUND, found: false, sources: [] };

    expect(parseContractQuestionAnswer(answer, content)).toEqual(answer);
    expect(() =>
      parseContractQuestionAnswer({ ...answer, answer: 'Não encontrei.' }, content),
    ).toThrow('does not match');
    expect(() =>
      parseContractQuestionAnswer({ ...answer, sources: [{ clause: '6.1' }] }, content),
    ).toThrow('does not match');
    expect(() =>
      parseContractQuestionAnswer(
        { answer: CONTRACT_QUESTION_NOT_FOUND, found: true, sources: [{ clause: '6.1' }] },
        content,
      ),
    ).toThrow('does not match');
  });

  it('rejeita JSON inválido, propriedade extra, fonte ausente, duplicada ou inventada', () => {
    const base = { answer: 'Manutenção mensal.', found: true, sources: [{ clause: '6.1' }] };

    expect(() => parseContractQuestionAnswer('não é JSON', content)).toThrow('valid JSON');
    expect(() =>
      parseContractQuestionAnswer({ ...base, legislation: 'Lei externa' }, content),
    ).toThrow('does not match');
    expect(() => parseContractQuestionAnswer({ ...base, sources: [] }, content)).toThrow(
      'does not match',
    );
    expect(() =>
      parseContractQuestionAnswer(
        { ...base, sources: [{ clause: '6.1' }, { clause: '6.1' }] },
        content,
      ),
    ).toThrow('does not match');
    expect(() =>
      parseContractQuestionAnswer({ ...base, sources: [{ clause: '99.9' }] }, content),
    ).toThrow('does not match');
  });
});
