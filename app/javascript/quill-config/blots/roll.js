const Inline = Quill.import('blots/inline');

class RollBlot extends Inline {
  static blotName = 'roll';
  static tagName = 'ts-roll';
}

Quill.register(RollBlot);
